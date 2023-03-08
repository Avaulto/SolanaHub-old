import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { stakePoolInfo } from '@solana/spl-stake-pool';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { firstValueFrom } from 'rxjs';
import { ApiService, SolanaUtilsService, JupiterStoreService } from 'src/app/services';
import { StakePoolProvider, StakePoolStats } from '../stake-pool.model';

@Component({
  selector: 'app-liquid-staking-stats',
  templateUrl: './liquid-staking-stats.component.html',
  styleUrls: ['./liquid-staking-stats.component.scss'],
})
export class LiquidStakingStatsComponent implements OnChanges {
  @Output() onStakePoolStats: EventEmitter<StakePoolStats> = new EventEmitter();
  @Input() selectedProvider: StakePoolProvider;
  @Input() wallet
  public stakePoolStats: StakePoolStats = {
    assetRatio: null,
    supply: null,
    TVL: null,
    validators: null,
    userHoldings: null,
    apy: null
  };
  constructor(
    private _apiService: ApiService,
    private _solanaUtilsService: SolanaUtilsService,
    private _jupStore: JupiterStoreService,
    private _walletStore: WalletStore
  ) { }

  ngOnChanges(): void {
    this.stakePoolStats = {
      assetRatio: null,
      supply: null,
      TVL: null,
      validators: null,
      userHoldings: null,
      apy: null
    };
    this.fetchProviderStats();
  }
  async fetchProviderStats() {

    if (this.selectedProvider.poolName.toLowerCase() == 'marinade') {
      await this.fetchMarinadeStats()
    } else {
      await this.fetchPoolProviderStatus()
    }
    await this.fetchUserHoldings();
    this.onStakePoolStats.emit(this.stakePoolStats);
  }

  async fetchPoolProviderStatus() {
    let info = await stakePoolInfo(this._solanaUtilsService.connection, this.selectedProvider.poolPublicKey);
    const solprice = await (await this._jupStore.fetchPriceFeed(info.poolMint)).data[info.poolMint].price;
    let solanaAmount = info.details.reserveStakeLamports;
    for (let i = 0; i < info.details.stakeAccounts.length; i++) {
      solanaAmount += parseInt(info.details.stakeAccounts[i].validatorLamports);
    }
    let tokenAmount = info.poolTokenSupply;
    let conversion = solanaAmount / Number(tokenAmount);
    try {
      const assetRatio = conversion
      const TVL = { staked_usd: solanaAmount / LAMPORTS_PER_SOL * solprice, staked_sol: solanaAmount / LAMPORTS_PER_SOL }
      const validators = info.details.currentNumberOfValidators//(await firstValueFrom(this._apiService.get('https://stake.solblaze.org/api/v1/validator_set'))).vote_accounts.length
      const supply = Number(tokenAmount) / LAMPORTS_PER_SOL
      // change blazestake name to solblaze as per solblaze request
      const stake_pool_data: any[] = (await firstValueFrom(this._apiService.get('https://cogentcrypto.io/api/stakepoolinfo')))
        .stake_pool_data.map(pool => {
          pool.poolName == 'BlazeStake' ? pool.poolName = 'SolBlaze' : null
          return pool
        }
        )

      const apy = stake_pool_data.find(pool => pool.poolName == this.selectedProvider.poolName).apy
      this.stakePoolStats = { assetRatio, TVL, validators, supply, apy };
    } catch (error) {
      console.error(error)
    }

  }

  async fetchMarinadeStats() {
    try {
      const assetRatio = await firstValueFrom(this._apiService.get('https://api.marinade.finance/msol/price_sol'))
      const mndeTVL = await firstValueFrom(this._apiService.get('https://api.marinade.finance/tlv'));
      const TVL = { staked_usd: mndeTVL.staked_usd, staked_sol: mndeTVL.staked_sol }
      const validators = (await firstValueFrom(this._apiService.post('https://no-program.marinade.finance/graphql', { query: "\n    query fetchValidators {\n  marinade_validators(use_latest_epoch: true) {\n    vote_address\n    apy\n    name\n    rank\n    avg_active_stake\n    marinade_staked\n  }\n}\n " }))).data.marinade_validators.length
      const supply = await firstValueFrom(this._apiService.get('https://api.marinade.finance/msol/supply')) / LAMPORTS_PER_SOL
      const apy = (await firstValueFrom(this._apiService.get('https://api.marinade.finance/msol/apy/30d'))).value * 100;
      this.stakePoolStats = { assetRatio, TVL, validators, supply, apy };
    } catch (error) {
      console.error(error)
    }
  }
  async fetchUserHoldings() {
    let TVL = { staked_usd: 0, staked_asset: 0 }
    try {

      const solprice = await (await this._jupStore.fetchPriceFeed('SOL')).data['SOL'].price;
      const splAccounts = await this._solanaUtilsService.getTokenAccountsBalance(this.wallet.publicKey) || [];
      const splAccount = splAccounts.find(account => account.mintAddress == this.selectedProvider.tokenMint.toBase58());
      TVL = { staked_usd: splAccount?.balance * solprice || 0, staked_asset: splAccount?.balance || 0 }
    } catch (error) {
      console.warn(error);
    }
    this.stakePoolStats.userHoldings = TVL

  }
}
