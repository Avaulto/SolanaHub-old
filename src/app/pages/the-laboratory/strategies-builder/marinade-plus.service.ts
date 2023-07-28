import { Injectable } from '@angular/core';
import { ApiService, DataAggregatorService, JupiterStoreService, SolanaUtilsService, UtilsService } from 'src/app/services';
import { StakePoolStoreService } from '../../defi/dapps/liquid-stake/stake-pool-store.service';
import { Observable, firstValueFrom, forkJoin, map, shareReplay } from 'rxjs';
import { SolendMarket, SolendWallet } from '@solendprotocol/solend-sdk';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { DefiStat, JupiterPriceFeed } from 'src/app/models';


export interface RewardStats {
  rewardsPerShare: string;
  totalBalance: string;
  lastSlot: number;
  side: string;
  tokenMint: string;
  reserveID: string;
  market: string;
  mint: string;
  rewardMint: string;
  rewardSymbol: string;
  rewardRates: RewardRateElement[];
  incentivizer: string;
}

export interface RewardRateElement {
  beginningSlot: number;
  rewardRate: number | string;
  name: string;
}


@Injectable({
  providedIn: 'root'
})
export class MarinadePlusService {
  private _solendWallet: SolendWallet;
  protected _msol = new PublicKey("mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So");
  protected _mnde = new PublicKey("MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey");
  constructor(
    private _apiService: ApiService,
    private _solanaUtilsService: SolanaUtilsService,
    private _stakePoolStoreService: StakePoolStoreService,
    private _jupiterPriceFeed: JupiterStoreService,
    private _utilService: UtilsService
  ) {

  }
  // to read more about marinade plus strategy, please refer to https://docs.avaulto.com/strategies/marinade-plus
  // get marinade APY
  // get solend APY on provide msol liquidity



  public strategyStats: DefiStat[] = [
    {
      title: 'YOUR SOL BALANCE',
      loading: true,
      desc: null
    },
    {
      title: 'YOUR CLAIMED REWARDS',
      loading: true,
      desc: null
    },
    {
      title: 'projected APY',
      loading: true,
      desc: null
    },
    {
      title: 'TVL',
      loading: true,
      desc: null
    },
  ]
  public async initSolendWallet(): Promise<void> {
    this._solendWallet = await SolendWallet.initialize(this._solanaUtilsService.getCurrentWallet() as any, this._solanaUtilsService.connection);
  }
  // get marinade + solend TVL
  public async getTVL(): Promise<number> {
    let tvl = 0
    try {
      const marinade_TVL = (await firstValueFrom(this._apiService.get('https://api.marinade.finance/tlv'))).staked_usd;
      const mSOLPrice = await (await this._jupiterPriceFeed.fetchPriceFeed('mSOL')).data['mSOL'].price
      const market = await SolendMarket.initialize(
        this._solanaUtilsService.connection,
      );

      // Read on-chain accounts for reserve data and cache
      await market.loadReserves();

      // calculate msol deposit
      const mSOLReserve = market.reserves.find((reserve) => reserve.config.liquidityToken.symbol == "mSOL")
      const mSOL_deposits = Number(mSOLReserve.stats.totalDepositsWads.toString()) / 10 ** 18 / 10 ** 9;
      const solendMsolTVL = mSOL_deposits * mSOLPrice
      tvl = this._utilService.numFormater(marinade_TVL + solendMsolTVL);
      console.log(marinade_TVL, solendMsolTVL, mSOL_deposits)
    } catch (error) {
      console.warn(error);
    }
    return tvl
  }

  // get marinade + solend APY
  public async getStrategyAPY(): Promise<number> {
    // get external market data
    const marinadeAPY = (await firstValueFrom(this._apiService.get('https://api.marinade.finance/msol/apy/30d'))).value;
    const mndePrice = await (await this._jupiterPriceFeed.fetchPriceFeed('MNDE')).data['MNDE'].price
    const mSOLPrice = await (await this._jupiterPriceFeed.fetchPriceFeed('mSOL')).data['mSOL'].price
    // const slot = await this._solanaUtilsService.connection.getSlot()
    const rewardStats: Promise<RewardStats[]> = await firstValueFrom(this._apiService.get('https://api.solend.fi/liquidity-mining/external-reward-stats-v2?flat=true'));
    const market = await SolendMarket.initialize(
      this._solanaUtilsService.connection,
    );

    // Read on-chain accounts for reserve data and cache
    await market.loadReserves();

    // calculate msol deposit
    const mSOLReserve = market.reserves.find((reserve) => reserve.config.liquidityToken.symbol == "mSOL")
    const mSOL_deposits = Number(mSOLReserve.stats.totalDepositsWads.toString()) / 10 ** 18 / 10 ** 9;
    // reminder! solend calc APY per sol price(not mSOL)
    const totalUsd_mSOL = mSOL_deposits * await this._msolConverter('mSOL', mSOLPrice);

    // calculate reward rates
    const rewardRates = (await rewardStats).find(r => r.rewardMint === this._mnde.toBase58()).rewardRates;
    const totalMNDERewards = Number(rewardRates[rewardRates.length - 1].rewardRate) / 10 ** 36;
    const totalUsd_rewards = totalMNDERewards * mndePrice;
    // const totalUsd_Deposits = mSOL_deposits * price_per_unit;

    // calculate mnde APY
    const slot = 500;
    const currentAPY = totalUsd_rewards / totalUsd_mSOL
    const solendAvg30daysAPY = currentAPY * slot / 446//(what is this ?);

    // strategy APY
    const strategyAPY = ((solendAvg30daysAPY + marinadeAPY) * 100).toFixedNoRounding(2)
    return strategyAPY;

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

      SOL_Holding = await this._msolConverter('SOL', depositBalance);
      console.log(depositBalance, SOL_Holding);
    } catch (error) {
      console.warn(error);
    }


    return SOL_Holding;
  }
  // convert back to msol/sol ratio
  private async _msolConverter(side: 'SOL' | 'mSOL', amount: number): Promise<number> {
    const assetRatio = await firstValueFrom(this._apiService.get('https://api.marinade.finance/msol/price_sol'))
    let converter;
    if (side === 'SOL') {
      converter = amount * assetRatio
    }
    if (side === 'mSOL') {
      converter = amount / assetRatio
    }
    return converter
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
