import { Injectable } from '@angular/core';
import {
  depositLiquidity,
  unstakeLiquidity,
  harvestLiquidity,
  paybackLoanIx,
  proposeLoanIx,
} from '@frakt-protocol/frakt-sdk/lib/loans';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { BN } from 'bn.js';

import { catchError, map, observable, Observable, shareReplay, switchMap, throwError } from 'rxjs';
import { toastData } from 'src/app/models';
import { ApiService, SolanaUtilsService, ToasterService, TxInterceptService, UtilsService } from 'src/app/services';

import {

  AllUserStats,
  BestBorrowSuggtion,
  CollectionInfo,
  FraktLiquidity,
  FraktNftItem,
  FraktNftItemWithLiquidity,
  FraktNftMetadata,
  FraktStats,
  OpenLoan,
  PoolIO,
  UserRewards
} from './frakt.model';


// interface MakeProposeTransaction = (params: {
//   nftMint: string;
//   valuation: number; //? lamports
//   loanValue: number; //? lamports
//   loanType: any //LoanType;
//   connection: any //web3.Connection;
//   wallet: any //WalletContextState;
// }) => Promise<{ transaction:any; signers: any }>;

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
  protected LOANS_PROGRAM_PUBKEY = new PublicKey("A66HabVL3DzNzeJgcHYtRRNW1ZRMKwBfrdSR4kLsZ9DJ")
  protected LOANS_FEE_ADMIN_PUBKEY = new PublicKey("9aTtUqAnuSMndCpjcPosRNf3fCkrTQAV8C8GERf3tZi3")
  // protected _
  // public orcaContext: WhirlpoolContext;
  // public orcaClient: WhirlpoolClient;

  // catch error
  private _formatErrors(error: any) {
    const toastData: toastData = {
      message: error.message,
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
  private async _fetchPoolLiquidity(): Promise<FraktLiquidity[]> {
    let poolsLiquidity: FraktLiquidity[] = []
    try {
      const poolRes: FraktLiquidity[] = await (await fetch(`${this.fraktApi}/liquidity/list`)).json();
      poolsLiquidity = poolRes;
      // poolsLiquidity.priceBasedLiqs = poolRes.priceBasedLiqs.map(pool => {
      //   if (!pool?.activeloansAmount) {
      //     pool.activeloansAmount = 0
      //   }
      //   return pool
      // });
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
  // available to borrow SOL agains user nfts
  public async borrowSuggetion(user: string): Promise<BestBorrowSuggtion[]> {

    let collateralNfts: BestBorrowSuggtion[];
    try {
      const listRes = await (await fetch(`${this.fraktApi}/nft/meta2/${user}?isPrivate=false&sortBy=maxLoanValue&sort=desc&skip=0`)).json();
      collateralNfts = listRes
    } catch (error) {
      console.error(error);
    }
    return collateralNfts
  }
  public async getMaxBorrow(user: string): Promise<number> {

    let maxBorrow: number;
    try {
      const res = await (await fetch(`${this.fraktApi}/nft/max-borrow/${user}`)).json();
      maxBorrow = res.maxBorrow
    } catch (error) {
      console.error(error);
    }
    return maxBorrow
  }

  public async getOpenLoans(user: string): Promise<OpenLoan[]> {

    let openLoans: OpenLoan[] = [];
    try {
      const res = await (await fetch(`${this.fraktApi}/loan/all/${user}`)).json();
      openLoans = res
    } catch (error) {
      console.error(error);
    }
    return openLoans
  }

  public async getUserRewards(user: string): Promise<UserRewards> {

    let userRewards: UserRewards = null;
    try {
      const res = await (await fetch(`${this.fraktApi}/stats/rewards/${user}`)).json();
      userRewards = res
    } catch (error) {
      console.error(error);
    }
    return userRewards
  }
  public async getAllUserStats(user: string): Promise<AllUserStats> {

    let allUserStats: AllUserStats = null;
    try {
      const res = await (await fetch(`${this.fraktApi}/stats/all/${user}`)).json();
      allUserStats = res
    } catch (error) {
      console.error(error);
    }
    return allUserStats
  }


  public getPoolsListFull(): Observable<FraktNftItemWithLiquidity[]> {
    // priceBasedLiqs
    let poolsFull = []
    return new Observable((obs) => obs.next(poolsFull)).pipe(
      switchMap(async () => {
        const nftWhitelist = await this._fetchNftListed();
        const poolsLiquidity = await this._fetchPoolLiquidity();

        poolsFull = nftWhitelist.map(nft => {
          const findLiquidity = poolsLiquidity.find(pool => pool.name == nft.name)
          if (findLiquidity) {
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
  async addLiquidity(walletOwner: PublicKey, liquidityPool: PublicKey, amount: any) {
    try {
      const depositTx = await depositLiquidity({
        programId: this.LOANS_PROGRAM_PUBKEY,
        liquidityPool,
        connection: this._solanaUtilsService.connection,
        user: walletOwner,
        amount
      })

      return await this._txInterceptService.sendTx([depositTx.ix], walletOwner)
    } catch (error) {
      console.warn(error)
    }
  }
  async removeLiquidity(walletOwner: PublicKey, liquidityPool: PublicKey, amount: any) {
    try {
      const { ix } = await unstakeLiquidity({
        programId: this.LOANS_PROGRAM_PUBKEY,
        adminPubkey: this.LOANS_FEE_ADMIN_PUBKEY,
        connection: this._solanaUtilsService.connection,
        liquidityPool,
        user: walletOwner,
        amount,
      });

      return await this._txInterceptService.sendTx([ix], walletOwner)
    } catch (error) {
      console.warn(error)
    }
  }



  async borrowSolUsingNft(walletOwner: PublicKey, collateralNft: BestBorrowSuggtion, loanValue: number, loanType: 'price_based' | 'time_based') {
    try {
      const loanToValue = (loanValue / collateralNft.valuation) * 1e4;
      const { ixs: instructions, loan: signer } = await proposeLoanIx({
        programId: this.LOANS_PROGRAM_PUBKEY,
        connection: this._solanaUtilsService.connection,
        user: walletOwner,
        nftMint: new PublicKey(collateralNft.mint),
        proposedNftPrice: new BN(collateralNft.valuation),
        isPriceBased: loanType === 'price_based',
        loanToValue: new BN(loanToValue),
        admin: this.LOANS_FEE_ADMIN_PUBKEY,
      });
      return await this._txInterceptService.sendTx([...instructions], walletOwner, [signer])
    } catch (error) {
      console.warn(error)
    }
  }
  async repayLoan(walletOwner: PublicKey, collateralNft: OpenLoan, loanValue?: number) {
    try {
      const { ixs: instructions } = await paybackLoanIx({
        programId: this.LOANS_PROGRAM_PUBKEY,
        connection: this._solanaUtilsService.connection,
        user: walletOwner,
        admin: this.LOANS_FEE_ADMIN_PUBKEY,
        loan: new PublicKey(collateralNft.pubkey),
        nftMint: new PublicKey(collateralNft.nft.mint),
        liquidityPool: new PublicKey(collateralNft.classicParams.liquidityPool),
        collectionInfo: new PublicKey(collateralNft.classicParams.collectionInfo),
        royaltyAddress: new PublicKey(collateralNft.classicParams.royaltyAddress),
        // paybackAmount,
      });
      return await this._txInterceptService.sendTx([...instructions], walletOwner)
    } catch (error) {
      console.warn(error)
    }
  }

  public async harvestRewards(walletOwner: PublicKey, liquidityPool: string) {
    try {
      const { ix } = await harvestLiquidity({
        programId: this.LOANS_PROGRAM_PUBKEY,
        adminPubkey: this.LOANS_FEE_ADMIN_PUBKEY,
        connection: this._solanaUtilsService.connection,
        liquidityPool: new PublicKey(liquidityPool),
        user: walletOwner,
      });
      return ix // await this._txInterceptService.sendTx([ix], walletOwner)
    } catch (error) {
      console.warn(error)
    }
  }
}
