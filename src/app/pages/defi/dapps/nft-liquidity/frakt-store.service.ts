import { Injectable } from '@angular/core';
import { depositLiquidity } from '@frakt-protocol/frakt-sdk/lib/loans';
import { DecimalUtil, Percentage, TokenUtil } from '@orca-so/common-sdk';
import { buildWhirlpoolClient, increaseLiquidityQuoteByInputTokenWithParams, PDAUtil, PriceMath, WhirlpoolClient, WhirlpoolContext } from '@orca-so/whirlpools-sdk';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import Decimal from 'decimal.js';
import { catchError, map, observable, Observable, shareReplay, switchMap, throwError } from 'rxjs';
import { toastData } from 'src/app/models';
import { ApiService, SolanaUtilsService, ToasterService, TxInterceptService, UtilsService } from 'src/app/services';
import { environment } from 'src/environments/environment';
import { CollectionInfo, FraktLiquidity, FraktNftItem, FraktNftItemWithLiquidity, FraktNftMetadata, FraktStats } from './frakt.model';



@Injectable({
  providedIn: 'root'
})
export class FraktStoreService {
  protected fraktApi = 'https://api.frakt.xyz';
  constructor(
    private _apiService: ApiService,
    private _toasterService: ToasterService,
    private _utilsService: UtilsService,
    private _solanaUtilsService: SolanaUtilsService,
    private _txInterceptService: TxInterceptService
  ) { }
  public orcaContext: WhirlpoolContext;
  public orcaClient: WhirlpoolClient;
  public orcaProgramId = new PublicKey(environment.orcaWhirlPool.programId);
  public orcaConfig = new PublicKey(environment.orcaWhirlPool.config);
  // catch error
  private _formatErrors(error: any) {
    const toastData: toastData = {
      message: error.message,
      icon: 'alert-circle-outline',
      segmentClass: "toastError",

    }
    this._toasterService.msg.next(toastData);
    return throwError((() => error))
  }
  public fetchStats(): Observable<FraktStats> {
    return this._apiService.get(`${this.fraktApi}/stats/total`).pipe(this._utilsService.isNotNull, map(fraktStats => {
      const {
        totalIssued,
        loansTvl,
        loansVolumeAllTime,
        activeLoansCount
      } = fraktStats;
      const defaults: FraktStats = {
        totalIssued: totalIssued || 0,
        loansTvl: loansTvl || 0,
        loansVolumeAllTime: loansVolumeAllTime || 0,
        activeLoansCount: activeLoansCount || 0
      }
      return defaults
    }), shareReplay(1))
  }
  private async _fetchNftListed(): Promise<FraktNftItem[]> {
    let nftWhitelist: FraktNftItem[] = []
    try {
      const listRes = await (await fetch(`${this.fraktApi}/whitelist`)).json();
      nftWhitelist = listRes
    } catch (error) {
      console.error(error);
    }
    return nftWhitelist

  }
  private async _fetchPoolLiquidity(): Promise<FraktLiquidity> {
    let poolsLiquidity: FraktLiquidity = {} as FraktLiquidity
    try {
      const poolRes: FraktLiquidity = await (await fetch(`${this.fraktApi}/liquidity/full`)).json();
      poolsLiquidity = poolRes;
      poolsLiquidity.priceBasedLiqs = poolRes.priceBasedLiqs.map(pool => {
        if (!pool?.activeloansAmount) {
          pool.activeloansAmount = 0
        }
        return pool
      });
    } catch (error) {
      console.error(error);
    }
    return poolsLiquidity
  }
  public async fetchPoolMetadata(nftName: string): Promise<FraktNftMetadata[]> {
    let nftMetadata: FraktNftMetadata[] = {} as FraktNftMetadata[]
    try {
      const nftMetadataRes: FraktNftMetadata[] = await (await fetch(`${this.fraktApi}/whitelist/${nftName}`)).json();
      // nftMetadata[0].price = nftMetadata[0].price / LAMPORTS_PER_SOL
      // nftMetadata[0].liquidityPool = this._utilsService.addrUtil(nftMetadata[0].liquidityPool).addrShort
      nftMetadata = nftMetadataRes

    } catch (error) {
      console.error(error);
    }
    return nftMetadata
  }
  public async fetchCollectionInfo(collectionName: string): Promise<CollectionInfo> {
    let collectionInfo: CollectionInfo = {} as CollectionInfo
    try {
      const collectionRes: CollectionInfo = await (await fetch(`${this.fraktApi}/stats/collections/${collectionName}`)).json();
      // nftMetadata[0].price = nftMetadata[0].price / LAMPORTS_PER_SOL
      // nftMetadata[0].liquidityPool = this._utilsService.addrUtil(nftMetadata[0].liquidityPool).addrShort
      collectionInfo = collectionRes

    } catch (error) {
      console.error(error);
    }
    return collectionInfo
  }
  public getPoolsListFull(): Observable<FraktNftItemWithLiquidity[]> {
    // priceBasedLiqs
    let poolsFull = []
    return new Observable((obs) => obs.next(poolsFull)).pipe(
      switchMap(async () => {
        const nftWhitelist = await this._fetchNftListed();
        const poolsLiquidity = await this._fetchPoolLiquidity();

        poolsFull = nftWhitelist.map(nft => {
          const findLiquidity = poolsLiquidity.priceBasedLiqs.find(pool => pool.name == nft.name)
          if (findLiquidity) {
            // console.log(findLiquidity)
            return { ...nft, ...findLiquidity }
          }
        })
          .filter(item => item)
          .sort((a, b) => a.totalLiquidity > b.totalLiquidity ? -1 : 1)
        return poolsFull
      }),
      catchError(this._formatErrors)
    )
  }
  addLiquidity(){
    depositLiquidity
  }
}
