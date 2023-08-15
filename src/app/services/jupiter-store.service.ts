import { Injectable } from '@angular/core';

import { PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';
import va from '@vercel/analytics';

import { catchError, firstValueFrom, Observable, throwError } from 'rxjs';
import { JupiterPriceFeed, JupRoute, Token, WalletExtended } from '../models';
import { ApiService, SolanaUtilsService, ToasterService, TxInterceptService } from './';


@Injectable({
  providedIn: 'root'
})
export class JupiterStoreService {

  private _formatErrors(error: any) {
    console.warn('my err', error)
    this._toasterService.msg.next({
      message: error.message,
      segmentClass: "toastError",
    });
    return throwError((() => error))
  }

  constructor(
    private _txInterceptService: TxInterceptService,
    private _toasterService: ToasterService,
    private _apiService: ApiService,
    private _solanaUtilsService: SolanaUtilsService,
  ) { }

  public async computeBestRoute(inputAmount: number,
    inputToken,
    outputToken,
    slippage: number): Promise<JupRoute> {
    let bestRoute: JupRoute = null;
    const inputAmountInSmallestUnits = inputToken
      ? Math.round(Number(inputAmount) * 10 ** inputToken.decimals)
      : 0;
    try {

      bestRoute = await (
        await fetch(`https://quote-api.jup.ag/v6/quote?inputMint=${inputToken.address}&outputMint=${outputToken.address}&amount=${inputAmountInSmallestUnits}&slippageBps=${slippage}`)
      ).json();

    } catch (error) {
      console.warn(error)
    }

    //return best route
    return bestRoute
  }
  public async swapTx(routeInfo: JupRoute): Promise<void> {
    // const arrayOfTx: Transaction[] = []
    try {
      const walletOwner = this._solanaUtilsService.getCurrentWallet().publicKey
      const { swapTransaction } = await (
        await fetch('https://quote-api.jup.ag/v6/swap', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            // asLegacyTransaction: true,
            // quoteResponse from /quote api
            quoteResponse: routeInfo,
            // user public key to be used for the swap
            userPublicKey: walletOwner.toString(),
            // auto wrap and unwrap SOL. default is true
            wrapUnwrapSOL: true,
            // feeAccount is optional. Use if you want to charge a fee.  feeBps must have been passed in /quote API.
            // feeAccount: "fee_account_public_key"
          })
        })
      ).json();
      const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
      var transaction = VersionedTransaction.deserialize(swapTransactionBuf);

      await this._txInterceptService.sendTxV2(transaction);

      va.track('jupiter', { type: `simple swap` });
    } catch (error) {
      console.warn(error)
    }



  }
  public fetchTokenList(): Observable<Token[]> {
    //const env = TOKEN_LIST_URL[environment.solanaEnv]//environment.solanaEnv
    return this._apiService.get('https://token.jup.ag/all').pipe(
      catchError(this._formatErrors)
    )
  }
  public async fetchPriceFeed(mintAddress: string, vsAmount: number = 1): Promise<JupiterPriceFeed> {
    let data: JupiterPriceFeed = null
    try {
      const res = await fetch(`https://quote-api.jup.ag/v4/price?ids=${mintAddress}&vsAmount=${vsAmount}`);
      data = await res.json();
    } catch (error) {
      console.warn(error);
    }
    return data
  }
}
