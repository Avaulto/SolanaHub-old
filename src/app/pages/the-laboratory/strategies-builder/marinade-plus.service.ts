import { Injectable } from '@angular/core';
import { ApiService, SolanaUtilsService } from 'src/app/services';
import { StakePoolStoreService } from '../../defi/dapps/liquid-stake/stake-pool-store.service';
import { Observable, firstValueFrom } from 'rxjs';
import { SolendMarket, SolendWallet } from '@solendprotocol/solend-sdk';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { DefiStat } from 'src/app/models';

@Injectable({
  providedIn: 'root'
})
export class MarinadePlusService {
  private _solendWallet: SolendWallet;
  protected _msol = new PublicKey("mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So");
  protected _mnde = new PublicKey("MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey")
  constructor(
    private _apiService: ApiService,
    private _solanaUtilsService: SolanaUtilsService,
    private _stakePoolStoreService: StakePoolStoreService
  ) {
    
  }
  // to read more about marinade plus strategy, please refer to https://docs.avaulto.com/strategies/marinade-plus
  // get marinade APY
  // get solend APY on provide msol liquidity

  public async initSolendWallet(): Promise<void> {
    this._solendWallet = await SolendWallet.initialize(this._solanaUtilsService.getCurrentWallet() as any, this._solanaUtilsService.connection);
  }

  public async getStrategyAPY() {
    const apy = (await firstValueFrom(this._apiService.get('https://api.marinade.finance/msol/apy/30d'))).value * 100;
    const solendWallet = await SolendWallet.initialize(this._solanaUtilsService.getCurrentWallet() as any, this._solanaUtilsService.connection);

    const market = await SolendMarket.initialize(
      this._solanaUtilsService.connection,
      //environment.solanaEnv as any, // optional environment argument
    );
    await market.loadRewards()
    const msolReserve = market.reserves.find((res) => res.config.liquidityToken.symbol == "mSOL");
    console.log(msolReserve);

  }
  public async getOnwerMsolDeposit(): Promise<number> {
    let SOL_Holding = 0
    try {
      const market = await SolendMarket.initialize(
        this._solanaUtilsService.connection,
        "production", // optional environment argument
        // new PublicKey("7RCz8wb6WXxUhAigok9ttgrVgDFFFbibcirECzWSBauM") // optional market address (TURBO SOL). Defaults to 'Main' market
      );
  
      const obligation = await market.fetchObligationByWallet(new PublicKey(this._solanaUtilsService.getCurrentWallet().publicKey));
      const deposit = obligation.deposits.find(deposit => deposit.mintAddress === this._msol.toBase58())
      // convert to readable numbers
      const depositBalance = deposit.amount.toNumber() / LAMPORTS_PER_SOL;
  
      SOL_Holding = await this._convertMsolToSol(depositBalance);
      console.log(depositBalance, SOL_Holding);
    } catch (error) {
      console.warn(error);
    }
    
    
    return SOL_Holding;
  }
  // convert back to msol/sol ratio
  private async _convertMsolToSol(amount: number): Promise<number> {
    const assetRatio = await firstValueFrom(this._apiService.get('https://api.marinade.finance/msol/price_sol'))
    const msolToSol =  amount * assetRatio;

    return msolToSol
  }
  public async getClaimedRewards(): Promise<number> {
    let MNDE_rewards = 0
    try {
      await this._solendWallet.loadRewards();
      // Claim rewards
      const mndeRewards = this._solendWallet.rewards["MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey"];
      MNDE_rewards = mndeRewards.claimedAmount / 10 ** mndeRewards.decimals;;
      console.log(MNDE_rewards);
    } catch (error) {
      console.warn(error);
    }
    return MNDE_rewards;

  }
}
