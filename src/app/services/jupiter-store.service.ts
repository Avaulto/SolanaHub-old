import { Injectable } from '@angular/core';
import { Jupiter, RouteInfo } from '@jup-ag/core';
import {  PublicKey,  Transaction } from '@solana/web3.js';
import JSBI from 'jsbi';

import { catchError, Observable, throwError } from 'rxjs';
import { JupiterPriceFeed, Token } from '../models';
import { ApiService, SolanaUtilsService, ToasterService } from './';

@Injectable({
  providedIn: 'root'
})
export class JupiterStoreService {

  private _formatErrors(error: any) {
    console.warn('my err',error)
    this._toasterService.msg.next({
      message: error.message,
      segmentClass: "toastError",
    });
    return throwError((() => error))
  }

  protected _jupiterAPI = 'https://quote-api.jup.ag/v4'
  private _jupiter: Jupiter;
  constructor(
    private _toasterService: ToasterService,
    private _apiService: ApiService,
    private _solanaUtilsService: SolanaUtilsService
  ) { }
  public async initJup(wallet) {
    if (!this._jupiter) {
      const connection = this._solanaUtilsService.connection;
      const pk = wallet.publicKey
      try {
        this._jupiter = await Jupiter.load({
          connection,
          wrapUnwrapSOL: true,
          cluster: 'mainnet-beta',
          user: pk, // or public key
          // platformFeeAndAccounts:  NO_PLATFORM_FEE,
          routeCacheDuration: 10_000, // Will not refetch data on computeRoutes for up to 10 seconds
        });
      } catch (error) {
        console.error(error)
      }
    }

  }
  public async computeBestRoute(inputAmount: number, inputToken, outputToken, slippage: number, LegacyTx: boolean = false): Promise<RouteInfo> {
    let bestRoute: RouteInfo = null;
    const inputAmountInSmallestUnits = inputToken
      ? Math.round(Number(inputAmount) * 10 ** inputToken.decimals)
      : 0;
    try {
      const routes = await this._jupiter.computeRoutes({
        inputMint: new PublicKey(inputToken.address),
        outputMint: new PublicKey(outputToken.address),
        amount: JSBI.BigInt(inputAmountInSmallestUnits),
        onlyDirectRoutes: false,
        slippage: slippage, // 1 = 1%
        forceFetch: true, // (optional) to force fetching routes and not use the cache
        // intermediateTokens, if provided will only find routes that use the intermediate tokens
        feeBps: 0
      });
      bestRoute = routes.routesInfos[0]
    } catch (error) {
      console.warn(error)
    }

    //return best route
    return bestRoute
  }
  public async swapTx(routeInfo: RouteInfo): Promise<Transaction[]> {

    const { transactions } = await this._jupiter.exchange({
      routeInfo
    });

    // Execute the transactions
    const { setupTransaction, swapTransaction, cleanupTransaction } = transactions
    const arrayOfTx: Transaction[] = []
    for (let transaction of [setupTransaction, swapTransaction, cleanupTransaction].filter(Boolean)) {
      if (!transaction) {
        continue;
      }
      arrayOfTx.push(transaction)
    }
      return arrayOfTx
  }
  public fetchTokenList(): Observable<Token[]> {
    //const env = TOKEN_LIST_URL[environment.solanaEnv]//environment.solanaEnv
    return this._apiService.get('https://token.jup.ag/strict').pipe(
      catchError(this._formatErrors)
    )
  }
  public async fetchPriceFeed(mintAddress: string, vsAmount: number = 1): Promise<JupiterPriceFeed> {
    let data: JupiterPriceFeed = null
    try {
      const res = await fetch(`${this._jupiterAPI}/price?ids=${mintAddress}&vsAmount=${vsAmount}`);
      data = await res.json();
    } catch (error) {
      console.warn(error);
    }
    return data
  }
}
