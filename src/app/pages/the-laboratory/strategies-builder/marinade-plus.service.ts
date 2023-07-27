import { Injectable } from '@angular/core';
import { ApiService, SolanaUtilsService } from 'src/app/services';
import { StakePoolStoreService } from '../../defi/dapps/liquid-stake/stake-pool-store.service';
import { Observable, firstValueFrom } from 'rxjs';
import { SolendMarket, SolendWallet } from '@solendprotocol/solend-sdk';

@Injectable({
  providedIn: 'root'
})
export class MarinadePlusService {

  constructor(
    private _apiService: ApiService,
    private _solanaUtilsService: SolanaUtilsService,
    private _stakePoolStoreService: StakePoolStoreService
  ) {
    this.getStrategyAPY()
  }
  // to read more about marinade plus strategy, please refer to https://docs.avaulto.com/strategies/marinade-plus
  // get marinade APY
  // get solend APY on provide msol liquidity

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


    // Claim rewards
    const mndeRewards = solendWallet.rewards["MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey"];
    console.log(
      "Claimable rewards:",
      mndeRewards, 
      "claimed", mndeRewards.claimedAmount / 10 ** mndeRewards.decimals
    );



  }
}
