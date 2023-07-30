import { Injectable } from '@angular/core';
import { ApiService, DataAggregatorService, JupiterStoreService, SolanaUtilsService, TxInterceptService, UtilsService } from 'src/app/services';
import { StakePoolStoreService } from '../../defi/dapps/liquid-stake/stake-pool-store.service';
import { Observable, firstValueFrom, forkJoin, map, shareReplay } from 'rxjs';
import { SolendAction, SolendMarket, SolendWallet } from '@solendprotocol/solend-sdk';
import { LAMPORTS_PER_SOL, PublicKey, Transaction } from '@solana/web3.js';
import { DefiStat, JupiterPriceFeed, Token } from 'src/app/models';
import { LabStrategyConfiguration } from 'src/app/models/defiLab.model';
import { LaboratoryStoreService } from '../laboratory-store.service';
import BN from 'bn.js';


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
  protected solblazePoolAddress = new PublicKey("stk9ApL5HeVAwPLr3TLhDXdZS8ptVu7zp6ov8HFDuMi");
  protected avaultoVoteKey = new PublicKey('7K8DVxtNJGnMtUY1CQJT5jcs8sFGSZTDiG7kowvFpECh');
  protected solendStakedSolPool = new PublicKey('HPzmDcPDCXAarsAxx3qXPG7aWx447XUVYwYsW4awUSPy');
  protected _msol = new PublicKey("mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So");
  protected _mnde = new PublicKey("MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey");
  protected _wSOL = new PublicKey("So11111111111111111111111111111111111111112");
  public wSOL = { address: "So11111111111111111111111111111111111111112" };
  constructor(
    private _apiService: ApiService,
    private _solanaUtilsService: SolanaUtilsService,
    private _stakePoolStore: StakePoolStoreService,
    private _jupiterStore: JupiterStoreService,
    private _utilService: UtilsService,
    private _laboratoryStore: LaboratoryStoreService,
    private _txInterceptService: TxInterceptService,
  ) {

  }
  // to read more about marinade plus strategy, please refer to https://docs.avaulto.com/strategies/marinade-plus
  // get marinade APY
  // get solend APY on provide msol liquidity



  public strategyStats: DefiStat[] = [
    {
      title: 'STRATEGY BALANCE',
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
      title: 'Total value locked',
      loading: true,
      desc: null
    },
  ]
  public strategyConfiguration: LabStrategyConfiguration = {
    strategyName: 'marinade-plus',
    title: 'Marinade Plus Strategy',
    rewardsSlogan: 'SOL + MNDE rewards',
    description: 'Marinade Liquid Staking + Soled Pool Strategy',
    strategyIcon: '/assets/images/icons/strategies-icons/msol-solend-mnde.png',
    APY_breakdown: [{
      icon: '/assets/images/icons/solana-logo.webp',
      description: 'Base 0% SOL Staking Rewards'
    },
    {
      icon: '/assets/images/icons/mnde.webp',
      description: 'Base 0% MNDE From Supply MMSOL Liquidity On Solend'
    }
    ],
    risk_breakdown: [{
      riskLevel: 'low',
      description: 'Audited Smart Contract',
    },
    {
      riskLevel: 'low',
      description: 'Single Asset Yield(No Impermanent Loss)',
    },
    {
      riskLevel: 'medium',
      description: 'High Volatility On MNDE USD Value',
    },
    {
      riskLevel: 'high',
      description: 'Multiple Smart Contract Exposure',
    }],
    strategy_breakdown: [
      'Deposit SOL To Marinade Liquid Staking Pool',
      'Get MSOL In Return',
      'Deposit MSOL Into Solend And Supply Liquidity On MSOL Pool'
    ],
    totalTransactions: 2,
    claimAssets: { 
      name: 'MNDE',
     amount: 0,
     toBeClaim: 0
   },
    assetHoldings: [
      {
        name: 'MSOL',
        balance: 0,
        icon: '/assets/images/icons/marinade-logo.png',
        totalUsdValue: 0,
        baseOfPortfolio: 0
      }
    ]
  }
  public async initStrategyStats(): Promise<void> {
    const apy = await this.getStrategyAPY();
    this.strategyStats[2].desc = apy.strategyAPY + '%'
    this.strategyStats[2].loading = false;

    this.strategyStats[3].desc = await this.getTVL() + ' $'
    this.strategyStats[3].loading = false;

    this.strategyConfiguration.APY_breakdown[0].description = `Base ${apy.marinadeAPY.toFixedNoRounding(2)}% SOL Staking Rewards`
    this.strategyConfiguration.APY_breakdown[1].description = `Base ${apy.lpAPY.toFixedNoRounding(2)}% MNDE From Supply MMSOL Liquidity On Solend`
  }

  // init all required function for the strategy 
  public async initStrategyStatefulStats(): Promise<void> {
    const wallet = this._solanaUtilsService.getCurrentWallet() as any;
    await this._stakePoolStore.initMarinade(wallet);
    this._solendWallet = await SolendWallet.initialize(wallet, this._solanaUtilsService.connection);

    const deposits = await this.getOnwerMsolDeposit();
    this.strategyStats[0].desc = deposits.SOL_holding.toFixedNoRounding(3) + ' SOL';
    this.strategyStats[0].loading = false;

    const rewards = await this.getMndeRewards();
    this.strategyStats[1].desc = rewards.claimed_MNDE.toFixedNoRounding(3) + ' MNDE';
    this.strategyStats[1].loading = false;

    this.strategyConfiguration.claimAssets.amount = rewards.claimable_MNDE.toFixedNoRounding(3);

    const mSOLPrice = await (await this._jupiterStore.fetchPriceFeed('mSOL')).data['mSOL'].price
    this.strategyConfiguration.assetHoldings[0].balance = deposits.mSOL_holding
    this.strategyConfiguration.assetHoldings[0].totalUsdValue = mSOLPrice * deposits.mSOL_holding
    this.strategyConfiguration.assetHoldings[0].baseOfPortfolio = 100;
  }
  // get marinade + solend TVL
  public async getTVL(): Promise<number> {
    let tvl = 0
    try {
      const marinade_TVL = (await firstValueFrom(this._apiService.get('https://api.marinade.finance/tlv'))).staked_usd;
      const mSOLPrice = await (await this._jupiterStore.fetchPriceFeed('mSOL')).data['mSOL'].price
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
    } catch (error) {
      console.warn(error);
    }
    return tvl
  }

  // get marinade + solend APY
  public async getStrategyAPY(): Promise<{ strategyAPY, marinadeAPY: number, lpAPY: number }> {
    // get external market data
    const marinadeAPY = (await firstValueFrom(this._apiService.get('https://api.marinade.finance/msol/apy/30d'))).value * 100;
    const mndePrice = await (await this._jupiterStore.fetchPriceFeed('MNDE')).data['MNDE'].price
    const mSOLPrice = await (await this._jupiterStore.fetchPriceFeed('mSOL')).data['mSOL'].price
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
    const solendAvg30daysAPY = currentAPY * slot / 446 * 100

    // strategy APY
    const strategyAPY = ((solendAvg30daysAPY + marinadeAPY)).toFixedNoRounding(2)
    return { strategyAPY, marinadeAPY, lpAPY: solendAvg30daysAPY };

  }
  public async getOnwerMsolDeposit(): Promise<{ SOL_holding: number, mSOL_holding: number }> {
    let SOL_holding = 0
    let mSOL_holding = 0
    try {
      const market = await SolendMarket.initialize(
        this._solanaUtilsService.connection,
        "production", // optional environment argument
        // new PublicKey("7RCz8wb6WXxUhAigok9ttgrVgDFFFbibcirECzWSBauM") // optional market address (TURBO SOL). Defaults to 'Main' market
      );

      const obligation = await market.fetchObligationByWallet(new PublicKey(this._solanaUtilsService.getCurrentWallet().publicKey));
      const depositBalance = obligation.deposits.find(deposit => deposit.mintAddress === this._msol.toBase58()).amount.toNumber() / LAMPORTS_PER_SOL

      if (depositBalance > 0.00001) {
        // convert to readable numbers
        mSOL_holding = depositBalance;
        SOL_holding = await this._msolConverter('SOL', mSOL_holding);
      }
    } catch (error) {
      console.warn(error);
    }


    return { SOL_holding, mSOL_holding };
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
  public async getMndeRewards(): Promise<{ claimed_MNDE, claimable_MNDE }> {
    let claimed_MNDE = 0;
    let claimable_MNDE = 0;
    try {
      await this._solendWallet.loadRewards();
      // Claim rewards
      const mndeRewards = this._solendWallet.rewards[this._mnde.toBase58()];
      claimed_MNDE = mndeRewards.claimedAmount / 10 ** mndeRewards.decimals;
      claimable_MNDE = mndeRewards.claimableAmount / 10 ** mndeRewards.decimals;
      console.log(mndeRewards)
    } catch (error) {
      console.warn(error);
    }
    return { claimed_MNDE, claimable_MNDE };

  }

  // deposit strategy flow:
  // stap 1 - stake sol for mSOL
  // step 1.1 - get convert ratio from sol to msol
  // stap 2 - deposit msol to solend
  public async deposit(SOL_amount: number) {
    const amountBn = new BN(SOL_amount * LAMPORTS_PER_SOL);
    const walletOwner = this._solanaUtilsService.getCurrentWallet().publicKey;
    try {

      const txIx1: Transaction = await this._mSolStake(amountBn);

      await this._txInterceptService.sendTx([txIx1], walletOwner)

      const msolDepositRatio = await this._msolConverter('mSOL', SOL_amount * 0.99);
      const mSOLamountBn = new BN(msolDepositRatio * LAMPORTS_PER_SOL);
      const { preLendingTxn, lendingTxn, postLendingTxn } = await (await this._depositMsolToSolend(mSOLamountBn, walletOwner)).getTransactions()
      const arrayOfTx: Transaction[] = []
      for (let transaction of [preLendingTxn, lendingTxn, postLendingTxn].filter(Boolean)) {
        if (!transaction) {
          continue;
        }
        arrayOfTx.push(transaction)
      }

      await this._txInterceptService.sendTx([...arrayOfTx], walletOwner)
    } catch (error) {
      console.warn(error);
    }
  }

  // withdraw strategy flow:
  // stap 1 - withdraw all mSOL from solend
  // step 2 - convert msol to sol
  public async withdraw(mSOL_amount: number) {
    const mSOLamountBn = new BN(mSOL_amount * LAMPORTS_PER_SOL);
    const walletOwner = this._solanaUtilsService.getCurrentWallet().publicKey;
    try {
      const { preLendingTxn, lendingTxn, postLendingTxn } = await (await this._withdrawMsolFromSolend(mSOLamountBn, walletOwner)).getTransactions()
      const arrayOfTx: Transaction[] = []
      for (let transaction of [preLendingTxn, lendingTxn, postLendingTxn].filter(Boolean)) {
        if (!transaction) {
          continue;
        }
        arrayOfTx.push(transaction)
      }

      await this._txInterceptService.sendTx([...arrayOfTx], walletOwner);
      const inputToken = {
        "address": this._msol.toBase58(),
        "decimals": 9,
        "symbol": "mSOL",
        "balance": mSOL_amount
      }
      const outputToken = {
        "address": "So11111111111111111111111111111111111111112",
        "decimals": 9,
        "symbol": "SOL",
      }

      const bestRoute = await this._jupiterStore.computeBestRoute(inputToken.balance, inputToken, outputToken, 1);
      const transaction: Transaction[] = await this._jupiterStore.swapTx(bestRoute);
      await this._txInterceptService.sendTx(transaction, walletOwner);

    } catch (error) {
      console.warn(error)
    }
  }
  // stake with marinade pool for mSOL
  private async _mSolStake(amount: any): Promise<Transaction | any> {
    const directToValidatorVoteAddress = this.avaultoVoteKey;
    const { transaction } = await this._stakePoolStore.marinadeSDK.deposit(amount, { directToValidatorVoteAddress });
    return transaction;
  }
  // deposit mSOL to solend pool
  private async _depositMsolToSolend(amountBase: BN, walletOwner: PublicKey) {
    const solendAction = await SolendAction
      .buildDepositTxns(
        this._solanaUtilsService.connection,
        amountBase,
        'mSOL',
        walletOwner,
        //environment.solanaEnv as any,
      );

    return solendAction

  }
  // withdraw mSOL to solend pool
  private async _withdrawMsolFromSolend(amountBase: BN, walletOwner: PublicKey) {
    const solendAction = await SolendAction
      .buildWithdrawTxns(
        this._solanaUtilsService.connection,
        amountBase,
        'mSOL',
        walletOwner,
      );

    return solendAction
  }

  // claim all rewards from solend
  public async claimMNDE(walletOwner: PublicKey) {

    const solendWallet = await SolendWallet.initialize(walletOwner as any, this._solanaUtilsService.connection);

    // Claim rewards
    const mndeRewards = solendWallet.rewards[this._mnde.toBase58()];
    // console.log(
    //   "Claimable rewards:",
    //   mndeRewards.claimableAmount
    // );

    const sig1 = await mndeRewards.rewardClaims
      .find((claim) => !claim.metadata.claimedAt)
      ?.claim();

    // Exercise options (after claiming)
    const slndOptionClaim = solendWallet.rewards["SLND_OPTION"].rewardClaims.find(
      (claim) => claim.metadata.optionMarket.userBalance
    );

    // const sig2 = await slndOptionClaim.exercise(
    //   slndOptionClaim.optionMarket.userBalance
    // );

    const [setupIxs, claimIxs] = await solendWallet.getClaimAllIxs();
    // Claim all claimable rewards
  }
}
