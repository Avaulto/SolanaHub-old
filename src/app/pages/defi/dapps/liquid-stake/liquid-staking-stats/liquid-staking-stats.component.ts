import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { stakePoolInfo } from '@solana/spl-stake-pool';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { firstValueFrom } from 'rxjs';
import { ApiService, SolanaUtilsService, DataAggregatorService } from 'src/app/services';
import { StakePoolProvider, StakePoolStats } from '../stake-pool.model';

@Component({
  selector: 'app-liquid-staking-stats',
  templateUrl: './liquid-staking-stats.component.html',
  styleUrls: ['./liquid-staking-stats.component.scss'],
})
export class LiquidStakingStatsComponent implements OnChanges {
  @Output() onStakePoolStats: EventEmitter<StakePoolStats> = new EventEmitter();
  @Input() selectedProvider: StakePoolProvider;
  public stakePoolStats: StakePoolStats = {
    assetRatio: null,
    apy: null,
    supply: null,
    TVL: null,
    validators: null,
    userHoldings: null
  };
  constructor(
    private _apiService: ApiService,
    private _solanaUtilsService: SolanaUtilsService,
    private _dataAggregatorService: DataAggregatorService,
    private _walletStore: WalletStore
  ) { }

  ngOnChanges(): void {
    this.stakePoolStats = {
      assetRatio: null,
      apy: null,
      supply: null,
      TVL: null,
      validators: null,
      userHoldings: null
    };
    this.fetchProviderStats();
  }
  async fetchProviderStats() {
    if (this.selectedProvider.name.toLowerCase() == 'marinade') {
      await this.fetchMarinadeStats()
    } else {
      await this.fetchSolBlazeStats()
    }
    await this.fetchUserHoldings();
    this.onStakePoolStats.emit(this.stakePoolStats);
  }

  async fetchSolBlazeStats() {
    const solprice = await (await firstValueFrom(this._dataAggregatorService.getCoinData('solana'))).price.usd;
    let info = await stakePoolInfo(this._solanaUtilsService.connection, this.selectedProvider.poolpubkey);

    let solanaAmount = info.details.reserveStakeLamports;
    for (let i = 0; i < info.details.stakeAccounts.length; i++) {
      solanaAmount += parseInt(info.details.stakeAccounts[i].validatorLamports);
    }
    let tokenAmount = info.poolTokenSupply;
    let conversion = solanaAmount / Number(tokenAmount);
    try {
      const apy = (await firstValueFrom(this._apiService.get('https://stake.solblaze.org/api/v1/apy'))).apy
      const assetRatio = conversion
      const TVL = { staked_usd: solanaAmount / LAMPORTS_PER_SOL * solprice, staked_sol: solanaAmount / LAMPORTS_PER_SOL }
      const validators = info.details.stakeAccounts.length;
      const supply = Number(tokenAmount) / LAMPORTS_PER_SOL
      this.stakePoolStats = { apy, assetRatio, TVL, validators, supply };
    } catch (error) {
      console.error(error)
    }

  }

  async fetchMarinadeStats() {
    try {
      const apy = (await firstValueFrom(this._apiService.get('https://api.marinade.finance/msol/apy/30d'))).value * 100
      const assetRatio = await firstValueFrom(this._apiService.get('https://api.marinade.finance/msol/price_sol'))
      const mndeTVL = await firstValueFrom(this._apiService.get('https://api.marinade.finance/tlv'));
      const TVL = { staked_usd: mndeTVL.staked_usd, staked_sol: mndeTVL.staked_sol }
      const validators = (await firstValueFrom(this._apiService.post('https://no-program.marinade.finance/graphql', { query: "\n    query fetchValidators {\n  marinade_validators(use_latest_epoch: true) {\n    vote_address\n    apy\n    name\n    rank\n    avg_active_stake\n    marinade_staked\n  }\n}\n " }))).data.marinade_validators.length
      const supply = await firstValueFrom(this._apiService.get('https://api.marinade.finance/msol/supply')) / LAMPORTS_PER_SOL
      // console.log(apy, assetRatio, TVL, validators, supply)
      this.stakePoolStats = { apy, assetRatio, TVL, validators, supply };
    } catch (error) {
      console.error(error)
    }
  }
  async fetchUserHoldings() {
    const solprice = await (await firstValueFrom(this._dataAggregatorService.getCoinData('solana'))).price.usd;
    const walletOwner:any = await (await firstValueFrom(this._walletStore.anchorWallet$)).publicKey;
    const splAccounts = await this._solanaUtilsService.getTokenAccountsBalance(walletOwner) || [];
    const splAccount = splAccounts.find(account => account.mintAddress == this.selectedProvider.mintAddress);
  
      const TVL = { staked_usd: splAccount?.balance * solprice || 0, staked_asset: splAccount?.balance || 0}
      this.stakePoolStats.userHoldings =  TVL

  }
}
