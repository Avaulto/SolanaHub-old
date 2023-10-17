import { Injectable } from '@angular/core';
import { Observable, catchError, firstValueFrom, map, switchMap, tap, throwError } from 'rxjs';
import { ApiService, JupiterStoreService, SolanaUtilsService, ToasterService } from 'src/app/services';

import { FetchersResult, mergePortfolioElementMultiples, PortfolioElement, PortfolioElementMultiple } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js'
import { Asset, Token } from 'src/app/models';
import va from '@vercel/analytics';
interface Platform {
  id: string
  name: string
  description: string
  image: string
  discord: string
  twitter: string
  website: string
  medium: string
}
@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

  constructor(
    private _apiService: ApiService,
    private _toasterService: ToasterService,
    private _jupStore: JupiterStoreService,
    private _solanaUtilsService: SolanaUtilsService
  ) { }
  // catch error
  private _formatErrors(error: any) {
    console.warn(error)
    this._toasterService.msg.next({
      message: error.error,
      segmentClass: "toastError",
    });
    va.track('failed to fetch portfolio', { error })
    return throwError((() => error))
  }
  private async _getPlatformsData(): Promise<Platform[]> {
    let platformInfo = []
    try {
      platformInfo = await (await fetch('https://portfolio-api.sonar.watch/v1/portfolio/platforms')).json();
    } catch (error) {
      console.warn(error)
    }
    return platformInfo
  }
  public getPortfolio(walletAddress: string): Observable<PortfolioElementMultiple[]> {
    return this._apiService.get(`https://portfolio-api.sonar.watch/v1/portfolio/fetch?owner=${walletAddress}&addressSystem=solana&useCache=false`).pipe(
      switchMap(async (data: FetchersResult | any) => {

        // merge duplications
        const editedData = mergePortfolioElementMultiples(data.elements);
        // fix broken object after mergePortfolioElementMultiples
        let editedDataExtended = this._findAndReplaceByPlatform(data.elements, editedData)

        // add icon and name for tokens
        const tokensInfo = await firstValueFrom(this._jupStore.fetchTokenList());

        const extendTokenData: any = editedDataExtended.find(group => group.platformId === 'wallet-tokens')
        this._addTokenData(extendTokenData.data.assets,  tokensInfo, extendTokenData.value)

        // add more data for platforms
        const getPlatformsData = await this._getPlatformsData();
        editedDataExtended.forEach(async group => {
          if (group.platformId !== 'wallet-tokens' && group.platformId !== 'wallet-nfts' && group.platformId != 'native-stake') {
            const platformData = getPlatformsData.find(platfom => platfom.id === group.platformId);
            group.platformUrl = this._addPlatformUrl(platformData.id)
            Object.assign(group, platformData);

            if(group.type === "liquidity" ){
              group.data.liquidities.forEach(async liquid => {
                this._addTokenData(liquid.assets,  tokensInfo, null)
              })
            }
            if(group.type === "borrowlend" ){
              this._addTokenData(group.data.suppliedAssets,  tokensInfo, null)
              // group.data.suppliedAssets.forEach(async supplied => {
              // })
            }
          }

        })

        return editedDataExtended
      }),

      catchError((error) => this._formatErrors(error))
    );

  }
  private _findAndReplaceByPlatform(original, editedData) {
    let edited = editedData
    original.filter(elements => elements.type !== 'multiple').forEach((element, index) => {
      const foundIndex = editedData.findIndex(x => x.platformId == element.platformId);
      edited[foundIndex] = element;
    });
    return edited
  }
  private _addPlatformUrl(platformId: string) {
    let platformUrl = ''
    switch (platformId) {
      case 'solend':
        platformUrl = 'https://solend.fi/dashboard'
        break;
      case 'orca':
        platformUrl = 'https://www.orca.so/liquidity/portfolio'
        break;
      case 'meteora':
        platformUrl = 'https://app.meteora.ag/'
        break;
      case 'marginfi':
        platformUrl = 'https://app.marginfi.com/'
        break;
      case 'raydium':
        platformUrl = 'https://raydium.io/clmm/pools/?tab=My+Pools'
        break;
    }
    return platformUrl;
  }

  private _addTokenData(assets,  tokensInfo: Token[], totalPortfolioValue: number): Asset[] {
    return assets.map(res => {
      res.data.address === "11111111111111111111111111111111" ? res.data.address = "So11111111111111111111111111111111111111112" : res.data.address
      // const { symbol, name, logoURI, decimals } = tokensInfo.find(token => token.address === res.data.address)
      const token = tokensInfo.find(token => token.address === res.data.address)
      res.baseOfPortfolio = res.value / totalPortfolioValue * 100
      res.name = token?.name ? token.name  : '';
      res.symbol = token?.symbol ? token.symbol  : '';
      res.icon = token?.logoURI ? token.logoURI  : '';;
      res.decimals = token?.decimals ? token.decimals  : '';;
      res.balance = res.data.amount
      res.totalUsdValue = res.value;
      res.totalSolValue = res.value / Number(this._solanaUtilsService.lastSolPrice())
      return res
    }).map(item => {
      Object.assign(item, item.data)
      delete item.data;

      return item
    })
  }

  private async _extendStakeAccount(walletAddress: string) {
    const stakeAccounts = await this._solanaUtilsService.getStakeAccountsByOwner(new PublicKey(walletAddress));
    const extendStakeAccount = await stakeAccounts.map(async (acc) => {
      const account = await this._solanaUtilsService.extendStakeAccount(acc)


      return account;
    })
    const extendStakeAccountRes = await Promise.all(extendStakeAccount);
    return extendStakeAccountRes;
  }
}