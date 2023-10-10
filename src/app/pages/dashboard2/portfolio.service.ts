import { Injectable } from '@angular/core';
import { Observable, catchError, firstValueFrom, map, switchMap, tap, throwError } from 'rxjs';
import { ApiService, JupiterStoreService, SolanaUtilsService, ToasterService } from 'src/app/services';

import { FetchersResult, mergePortfolioElementMultiples, PortfolioElement, PortfolioElementMultiple } from '@sonarwatch/portfolio-core';
import { PublicKey } from '@solana/web3.js'
import { Asset, Token } from 'src/app/models';


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
    return throwError((() => error))
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
        this._addTokenData(extendTokenData.data.assets,extendTokenData.value, tokensInfo)
        
        // add icon for defi apps
        const final = []
        editedDataExtended.forEach(async group => {
          if (group.label !== "Wallet" && group.label !== "Staked") {
            const { logoURI, platformUrl } = this._addPlatformData(group.platformId);
            final.push({ ...group, platformUrl, logoURI })
          } else {
            final.push(group)
          }
          if(group.platformId === 'native-stake'){
            const extendStakeAccount = await this._extendStakeAccount(walletAddress)
            group.data = extendStakeAccount
          }
        })
      
        console.log(final)
        return final
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
  private _addPlatformData(platformId) {
    let logoURI = ''
    let platformUrl = ''
    switch (platformId) {
      case 'solend':
        logoURI = 'assets/images/icons/solend-logo.png'
        platformUrl = 'https://solend.fi/dashboard'
        break;
      case 'orca':
        logoURI = 'assets/images/icons/orca-logo.png'
        platformUrl = 'https://www.orca.so/liquidity/portfolio'
        break;
      case 'meteora':
        logoURI = 'assets/images/icons/meteora-logo.jpeg'
        platformUrl = 'https://app.meteora.ag/'
        break;
      case 'marginfi':
        logoURI = 'assets/images/icons/marginfi-logo.jpeg'
        platformUrl = 'https://app.marginfi.com/'
        break;
      case 'raydium':
        logoURI = 'assets/images/icons/ray-logo.jpeg'
        platformUrl = 'https://raydium.io/clmm/pools/?tab=My+Pools'
        break;


      default:
        logoURI = 'assets/images/nft-not-found.svg'
        break;
    }
    return { logoURI, platformUrl };
  }

  private _addTokenData(assets,totalPortfolioValue: number, tokensInfo:Token[]): Asset[] {
    return assets.map(res => {
      res.data.address === "11111111111111111111111111111111" ? res.data.address = "So11111111111111111111111111111111111111112" : res.data.address
      const { symbol,name, logoURI, decimals } = tokensInfo.find(token => token.address === res.data.address)
      res.baseOfPortfolio = res.value / totalPortfolioValue * 100
      res.name = name
      res.symbol = symbol;
      res.logoURI = logoURI;
      res.decimals = decimals;
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

  private async _extendStakeAccount(walletAddress: string){
    const stakeAccounts = await this._solanaUtilsService.getStakeAccountsByOwner(new PublicKey(walletAddress));
    const extendStakeAccount = await stakeAccounts.map(async (acc) => {
      const account = await this._solanaUtilsService.extendStakeAccount(acc)

    
      return account;
    })
    const extendStakeAccountRes = await Promise.all(extendStakeAccount);
    return extendStakeAccountRes;
  }
}
