import { Injectable } from '@angular/core';
import { PublicKey } from '@metaplex-foundation/js';
import { Observable, catchError, map, shareReplay, throwError } from 'rxjs';
import { toastData } from 'src/app/models';
import { ApiService, SolanaUtilsService, ToasterService, TxInterceptService, UtilsService } from 'src/app/services';

import { StaticTokenListResolutionStrategy, TokenInfo } from "@solana/spl-token-registry";
import { AnchorProvider } from '@project-serum/anchor';
import VaultImpl, { KEEPER_URL } from '@mercurial-finance/vault-sdk';
import { BN } from 'bn.js';
import { environment } from 'src/environments/environment';
import { Cluster } from '@solana/web3.js';
import { MeteoraStats, VaultsInfo } from './meteroa.model';

@Injectable({
  providedIn: 'root'
})
export class MeteoraStoreService {
  // catch error
  private _formatErrors(error: any) {
    const toastData: toastData = {
      message: error.message,
      segmentClass: "toastError",

    }
    this._toasterService.msg.next(toastData);
    return throwError((() => error))
  }
  protected meteoraAPI = 'https://merv2-api.mercurial.finance';
  // https://merv2-api.mercurial.finance/api/vault_state/<token_mint_address>
  constructor(
    private _apiService: ApiService,
    private _toasterService: ToasterService,
    private _utilsService: UtilsService,
    private _solanaUtilsService: SolanaUtilsService,
    private _txInterceptService: TxInterceptService
  ) { }
  protected SOL = new PublicKey("So11111111111111111111111111111111111111112")
  protected USDC_SPL = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v")
  protected USDT_SPL = new PublicKey("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB")
  private _Vaults: VaultsInfo[] = []
  public fetchStats(): Observable<MeteoraStats> {
    return this._apiService.get(`${this.meteoraAPI}/vault_info`).pipe(this._utilsService.isNotNull, map((vaults: VaultsInfo[]) => {
      this._Vaults = vaults;
      const nonUsdToken = ['SOL','mSOL','stSOL']
      const TVL = vaults.reduce(
        (accumulator, currentValue) => {
          if(nonUsdToken.includes(currentValue.symbol)){
            accumulator + (currentValue.total_amount / currentValue.usd_rate)

          }else{

            accumulator + currentValue.total_amount
          }
           return 0},
        0
      );
      const totalValueEarn = vaults.reduce(
        (accumulator, currentValue) => accumulator + currentValue.earned_amount,
        0
      );
      const defaults: MeteoraStats = {
        TVL: TVL || 0,
        totalValueEarn: totalValueEarn || 0,

      }
      return defaults
    }),
      shareReplay(1),
      catchError(this._formatErrors))
  }
  private async _initVaule(symbol: string) {
    // Retrieve the token info for the vault (example: SOL)
    const tokenMap = new StaticTokenListResolutionStrategy().resolve();
    const SOL_TOKEN_INFO = tokenMap.find(token => token.symbol === symbol) as TokenInfo;

    // Getting a Vault Implementation instance (SOL)
    const vault: VaultImpl = await VaultImpl.create(
      this._solanaUtilsService.connection,
      SOL_TOKEN_INFO,
      {
        cluster: environment.solanaEnv as Cluster,
        // affiliateId: new PublicKey('7236FoaWTXJyzbfFPZcrzg3tBpPhGiTgXsGWvjwrYfiF')
      }
    );
    return { vault, SOL_TOKEN_INFO }
  }
  // Get on-chain data from the vault and off-chain data from the api
  public getVaultDetails = async (vaultImpl: VaultImpl, SOL_TOKEN_INFO: TokenInfo) => {

    //Get the total unlocked amount in vault that is withdrawable by users
    const vaultUnlockedAmount = (await vaultImpl.getWithdrawableAmount()).toNumber();
    //Calculate virtual price using the vault's unlocked amount and lp supply
    const virtualPrice = (vaultUnlockedAmount / vaultImpl.lpSupply.toNumber()) || 0;

    // Get the off-chain data from API
    const URL = KEEPER_URL[environment.solanaEnv];
    const vaultStateAPI = await (await fetch(`${URL}/vault_state/${SOL_TOKEN_INFO.address}`)).json();
    console.log(vaultStateAPI)
    const totalAllocation = vaultStateAPI.strategies.reduce((acc, item) => acc + item.liquidity, vaultStateAPI.token_amount)

    return {
      lpSupply: (await vaultImpl.getVaultSupply()).toString(),
      withdrawableAmount: vaultUnlockedAmount,
      virtualPrice,
      usd_rate: vaultStateAPI.usd_rate,
      closest_apy: vaultStateAPI.closest_apy, // 1 hour average APY
      average_apy: vaultStateAPI.average_apy, // 24 hour average APY
      long_apy: vaultStateAPI.long_apy, // 7 day average APY
      earned_amount: vaultStateAPI.earned_amount, // total fees earned by vault
      virtual_price: vaultStateAPI.virtual_price,
      total_amount: vaultStateAPI.total_amount,
      total_amount_with_profit: vaultStateAPI.total_amount_with_profit,
      token_amount: vaultStateAPI.token_amount,
      fee_amount: vaultStateAPI.fee_amount,
      lp_supply: vaultStateAPI.lp_supply,
      strategyAllocation: vaultStateAPI.strategies
        .map(item => ({
          name: item.strategy_name,
          liquidity: item.liquidity,
          allocation: ((item.liquidity / totalAllocation) * 100).toFixed(0),
          maxAllocation: item.max_allocation,
        }))
        .concat({
          name: 'Vault Reserves',
          liquidity: vaultStateAPI.token_amount,
          allocation: ((vaultStateAPI.token_amount / totalAllocation) * 100).toFixed(0),
          maxAllocation: 0,
        })
        .sort((a, b) => b.liquidity - a.liquidity),
    }
  }
  async deposit(vault: VaultImpl, walletOwner: PublicKey, SOL_TOKEN_INFO: TokenInfo, depositAmount: number) {
    // Deposits into the vault 
    // const depositAmount = 0.1;
    const depositTx = await vault.deposit(walletOwner, new BN(depositAmount * 10 ** SOL_TOKEN_INFO.decimals)); // 0.1 SOL
    this._txInterceptService.sendTx([depositTx], walletOwner)
    // const depositResult = await provider.sendAndConfirm(depositTx);
  }
  async widthaw(vault: VaultImpl, walletOwner: PublicKey, SOL_TOKEN_INFO: TokenInfo, withdrawAmount: number) {
    // Withdraw from the vault
    // const withdrawAmount = 0.05;
    const withdrawTx = await vault.withdraw(walletOwner, new BN(withdrawAmount * 10 ** SOL_TOKEN_INFO.decimals)); // 0.05 SOL
    this._txInterceptService.sendTx([withdrawTx], walletOwner)
    // const withdrawResult = await provider.sendAndConfirm(withdrawTx); // Transaction hash    
  }
}
