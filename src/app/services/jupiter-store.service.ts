import { Injectable } from '@angular/core';
import { Jupiter, RouteInfo, TOKEN_LIST_URL } from '@jup-ag/core';
import { PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';
import JSBI from 'jsbi';
import { environment } from 'src/environments/environment.prod';
import { JupiterPriceFeed, Token } from '../models';
import { SolanaUtilsService } from './solana-utils.service';

@Injectable({
  providedIn: 'root'
})
export class JupiterStoreService {
  protected _jupiterAPI = 'https://quote-api.jup.ag/v4'
  private _jupiter: Jupiter;
  constructor(private _solanaUtilsService: SolanaUtilsService) { }
  public async initJup(wallet) {
    const connection = this._solanaUtilsService.connection;
    const pk = wallet.publicKey// this._walletStore.anchorWallet$.pipe(switchMap(wallet => wallet.publicKey))
    try {
      this._jupiter = await Jupiter.load({
        connection,
        cluster: 'mainnet-beta',
        user: pk, // or public key
        // platformFeeAndAccounts:  NO_PLATFORM_FEE,
        routeCacheDuration: 10_000, // Will not refetch data on computeRoutes for up to 10 seconds
      });
    } catch (error) {
      console.error(error)
    }
  }
  public async computeBestRoute(inputAmount, inputToken, outputToken, LegacyTx: boolean = false):Promise<RouteInfo> {
    const inputAmountInSmallestUnits = inputToken
      ? Math.round(Number(inputAmount) * 10 ** inputToken.decimals)
      : 0;
    const routes = await this._jupiter.computeRoutes({
      inputMint: new PublicKey(inputToken.address),
      outputMint: new PublicKey(outputToken.address),
      amount: JSBI.BigInt(inputAmountInSmallestUnits),
      slippageBps: 1, // 1 = 1%
      forceFetch: true, // (optional) to force fetching routes and not use the cache
      asLegacyTransaction: LegacyTx
      // intermediateTokens, if provided will only find routes that use the intermediate tokens
      // feeBps
    });
    //return best route
    return routes.routesInfos[0]
  }
  public async swapTx(routeInfo: RouteInfo): Promise<VersionedTransaction>{
    const { swapTransaction } = await this._jupiter.exchange({
      routeInfo
    });
    return swapTransaction as VersionedTransaction;
  }
  public async fetchTokenList(): Promise<Token[]> {
    let tokens: Token[] = []
    try {
      const env = 'mainnet-beta'//environment.solanaEnv
      tokens = await (await fetch(TOKEN_LIST_URL[env])).json();
    } catch (error) {
      console.warn(error)
    }
    return tokens
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
