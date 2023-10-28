import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, switchMap, throwError } from 'rxjs';
import { Market, Stats } from './solend.model';
import { ApiService, SolanaUtilsService, ToasterService, TxInterceptService } from 'src/app/services';
import va from '@vercel/analytics';
import { SolendAction, SolendMarket } from '@solendprotocol/solend-sdk';
import { BN } from '@marinade.finance/marinade-ts-sdk';
import { PublicKey, Transaction } from '@solana/web3.js';

@Injectable({
  providedIn: 'root'
})
export class SolendStoreService {

  protected solendAPI = 'https://api.solend.fi'
  private _solendSDK: BehaviorSubject<SolendMarket> = new BehaviorSubject(null as SolendMarket);
  public solendSDK$: Observable<SolendMarket> = this._solendSDK.asObservable()
  constructor(
    private _solanaUtilsService: SolanaUtilsService,
    private _apiService: ApiService,
    private _toasterService: ToasterService,
    private _txInterceptService: TxInterceptService
  ) {


  }

  // catch error
  private _formatErrors(error: any) {
    console.warn(error)
    this._toasterService.msg.next({
      message: error.error,
      segmentClass: "toastError",
    });
    va.track('failed to solend data', { error })
    return throwError((() => error))
  }

  public getSolendSDK(): SolendMarket {
    return this._solendSDK.value;
  }
  public async initSolendSDK() {
    const solendMarket = await SolendMarket.initialize(
      this._solanaUtilsService.connection,
      'production',
      '4UpD2fh7xH3VP9QQaXtsS1YY3bxzWhtfpks7FatyKvdY'
    );
    // 2. Read on-chain accounts for reserve data and cache
    await solendMarket.loadAll();
    // Refresh all cached data
    // solendMarket.refreshAll()
    this._solendSDK.next(solendMarket)
  }
  public getSolendStats(): Observable<Stats> {
    //const env = TOKEN_LIST_URL[environment.solanaEnv]//environment.solanaEnv
    return this._apiService.get(`${this.solendAPI}/stats`).pipe(
      map((stats: Stats) => {
        const { totalBorrowsUSD, totalDepositsUSD } = stats
        stats.solendTVL = totalDepositsUSD - totalBorrowsUSD
        return stats
      }),
      catchError((error) => this._formatErrors(error)))
  }

  public async getWalletObligations() {
    const obligation = await this.getSolendSDK().fetchObligationByWallet(this._solanaUtilsService.getCurrentWallet().publicKey);
    return obligation
  }
  // supply asset to solend pool
  public async supplyTx(amountBase: BN, symbol: string, walletOwner: PublicKey): Promise<void> {
    try {
      const solendAction = await SolendAction
        .buildDepositTxns(
          this._solanaUtilsService.connection,
          amountBase,
          symbol,
          walletOwner,
          //environment.solanaEnv as any,
        );
      const { preLendingTxn, lendingTxn, postLendingTxn } = await solendAction.getTransactions()
      const arrayOfTx: Transaction[] = this._validatorIx([preLendingTxn, lendingTxn, postLendingTxn])
      let tx = await this._txInterceptService.sendTx([...arrayOfTx], walletOwner)
      if(tx){
        va.track('solend action', { type: 'supply'})
      }
    } catch (error) {
      this._formatErrors(error)
    }


  }
  // withdraw from solend pool
  public async withdrawTx(amountBase: BN, symbol: string, walletOwner: PublicKey): Promise<void> {
    try {
      const solendAction = await SolendAction
        .buildWithdrawTxns(
          this._solanaUtilsService.connection,
          amountBase,
          symbol,
          walletOwner,
        );
      const { preLendingTxn, lendingTxn, postLendingTxn } = await solendAction.getTransactions()
      const arrayOfTx: Transaction[] = this._validatorIx([preLendingTxn, lendingTxn, postLendingTxn])
      let tx = await this._txInterceptService.sendTx([...arrayOfTx], walletOwner)
      if(tx){
        va.track('solend action', { type: 'withdraw'})
      }
    } catch (error) {
      this._formatErrors(error)
    }

  }
  // lend from solend pool
  public async borrowTx(amountBase: BN, symbol: string, walletOwner: PublicKey): Promise<void> {
    try {
      const solendAction = await SolendAction
        .buildBorrowTxns(
          this._solanaUtilsService.connection,
          amountBase,
          symbol,
          walletOwner,
        );
      const { preLendingTxn, lendingTxn, postLendingTxn } = await solendAction.getTransactions()
      const arrayOfTx: Transaction[] = this._validatorIx([preLendingTxn, lendingTxn, postLendingTxn])
      let tx = await this._txInterceptService.sendTx([...arrayOfTx], walletOwner)
      if(tx){
        va.track('solend action', { type: 'borrow'})
      }
    } catch (error) {
      this._formatErrors(error)
    }
  }
  // repay a borrow from solend pool
  public async repayTx(amountBase: BN, symbol: string, walletOwner: PublicKey): Promise<void> {
    try {
      const solendAction = await SolendAction
        .buildRepayTxns(
          this._solanaUtilsService.connection,
          amountBase,
          symbol,
          walletOwner,
        );
      const { preLendingTxn, lendingTxn, postLendingTxn } = await solendAction.getTransactions()
      const arrayOfTx: Transaction[] = this._validatorIx([preLendingTxn, lendingTxn, postLendingTxn])

      let tx = await this._txInterceptService.sendTx([...arrayOfTx], walletOwner)
      if(tx){
        va.track('solend action', { type: 'repay'})
      }
    } catch (error) {
      this._formatErrors(error)
    }
  }

  private _validatorIx(ixs: Transaction[]): Transaction[] {
    const arrayOfTx: Transaction[] = []
    for (let transaction of ixs.filter(Boolean)) {
      if (!transaction) {
        continue;
      }
      arrayOfTx.push(transaction)
    }
    return arrayOfTx
  }
}
