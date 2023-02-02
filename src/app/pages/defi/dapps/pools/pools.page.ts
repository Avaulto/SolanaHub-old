import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  WhirlpoolContext, buildWhirlpoolClient, ORCA_WHIRLPOOL_PROGRAM_ID,
  PDAUtil, PriceMath, PoolUtil, AccountFetcher, WhirlpoolClient
} from "@orca-so/whirlpools-sdk";
// import { AnchorProvider } from "@friktion-labs/anchor";
import { MintLayout, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { DecimalUtil, TokenUtil } from "@orca-so/common-sdk";
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { ApiService, SolanaUtilsService, UtilsService } from 'src/app/services';
import { environment } from 'src/environments/environment';
import { OrcaWhirlPool, Whirlpool, WhirlPoolsStats } from './orca.model';
import { formatCurrency } from '@angular/common';
import { catchError, firstValueFrom, map, Observable, shareReplay, Subscription, switchMap, takeUntil, tap } from 'rxjs';
import { PublicKey, Transaction } from '@solana/web3.js';
import Decimal from 'decimal.js';
import { OrcaStoreService } from './orca-store.service';
@Component({
  selector: 'app-pools',
  templateUrl: './pools.page.html',
  styleUrls: ['./pools.page.scss'],
})
export class PoolsPage {
  constructor(
    private _walletStore: WalletStore,
    private _apiService: ApiService,
    private _utilsService: UtilsService,
    private _orcaStoreService: OrcaStoreService,
    private _solanaUtilsService: SolanaUtilsService
  ) { }
  public menu: string[] = ['explore', 'portfolio'];
  public currentTab: string = this.menu[0];
  public orcaPools: Observable<OrcaWhirlPool> = this._orcaStoreService.fetchPools().pipe(
    map((res) => {
      this.whirlPoolsStats = this.calcStats(res.whirlpools);
      return res
    }))
  public whirlPoolsStats: WhirlPoolsStats = {
    tvl: { title: 'Total Value Locked', value: '' },
    vol: { title: '24h Volume', value: '' },
    weeklyReward: { title: 'Weekly Rewards', value: '' },
    orcaPrice: { title: 'ORCA Price', value: '' }
  };
  private wallet$: Subscription;

  ionViewWillEnter(){
    this.wallet$ = this._walletStore.anchorWallet$.pipe(
      this._utilsService.isNotUndefined,
      this._utilsService.isNotNull
      ).subscribe(wallet =>{
      this._orcaStoreService.initOrca(wallet)
    })
  }
  ionViewDidLeave(){
    this.wallet$.unsubscribe();
  }

  async getPoolReward(pool: Whirlpool) {
    const ctx = this._orcaStoreService.orcaContext
    const client = this._orcaStoreService.orcaClient;

    const config_pubkey = new PublicKey(environment.orcaWhirlPool.config);
    const tick_spacing = 64;
    const whirlpool_pubkey = PDAUtil.getWhirlpool(
      ORCA_WHIRLPOOL_PROGRAM_ID,
      config_pubkey,
      new PublicKey(pool.tokenA.mint), new PublicKey(pool.tokenB.mint), tick_spacing).publicKey;
    console.log("whirlpool_key", pool.tokenA, whirlpool_pubkey.toBase58());
    const whirlpool = await client.getPool(whirlpool_pubkey);
    const whirlpool_data = whirlpool.getData();

    // WhirlpoolData type members: https://orca-so.github.io/whirlpools/modules.html#WhirlpoolData

    for (let i = 0; i < 3; i++) {
      if (PoolUtil.isRewardInitialized(whirlpool_data.rewardInfos[i])) {
        const mint_account_info = await ctx.connection.getAccountInfo(whirlpool_data.rewardInfos[i].mint);
        const mint = MintLayout.decode(mint_account_info.data.slice(0, MintLayout.span));
        const decimals = mint.decimals;
        console.log(`reward[${i}] mint`, whirlpool_data.rewardInfos[i].mint.toBase58());
        console.log(`reward[${i}] decimals`, decimals);
        console.log(`reward[${i}] vault`, whirlpool_data.rewardInfos[i].vault.toBase58());
        console.log(`reward[${i}] authority`, whirlpool_data.rewardInfos[i].authority.toBase58());
        console.log(`reward[${i}] growthGlobal`, whirlpool_data.rewardInfos[i].growthGlobalX64.toString());
        console.log(`reward[${i}] * emissionsPerSecond`, pool.tokenA.name, pool.tokenB.name, whirlpool_data.rewardInfos[i].emissionsPerSecondX64.toString());

        const emissionsPerWeek = new Decimal(whirlpool_data.rewardInfos[i].emissionsPerSecondX64
          .shrn(64)
          .muln(60 * 60 * 24 * 7).toString())
          .div(new Decimal(10 ** decimals))
          .ceil();

        //console.log(`reward[${i}] * emissionsPerWeek`, whirlpool_data.rewardInfos[i].emissionsPerSecondX64.shrn(64).muln(60*60*24*7).div(new BN(10**decimals)).toString());
        console.log(`reward[${i}] * emissionsPerWeek ${pool.tokenA.name} ${pool.tokenB.name}`, emissionsPerWeek.toString());
      }
      else {
        console.log(`reward[${i}] UNINITIALIZED`);
      }
    }
  }
  calcStats(pools: Whirlpool[]): WhirlPoolsStats {
    let tvl = 0;
    let vol = 0;
    let weeklyReward = 0;
    let orcaPrice = 0;
    pools.map((pool) => {
      tvl += pool?.tvl || 0;;
      vol += pool?.volume?.day || 0;
      weeklyReward += pool?.reward0Apr?.week || 0;;
      if (pool.tokenA.symbol.toLowerCase() == 'orca' && pool.tokenB.symbol.toLowerCase() == 'usdc') {
        orcaPrice = pool.price;
      }
    });
    const formatUSD = (val: number) => formatCurrency(val, 'en-us', '$')
    this.whirlPoolsStats = {
      tvl: { title: 'Total Value Locked', value: formatUSD(tvl) },
      vol: { title: '24h Volume', value: formatUSD(vol) },
      weeklyReward: { title: 'Weekly Rewards', value: formatUSD(weeklyReward) },
      orcaPrice: { title: 'ORCA Price', value: formatUSD(orcaPrice) }
    }
    return this.whirlPoolsStats;
  }
  public searchTerm = ''
  public searchPool(term: any): void {
    this.searchTerm = term.value.toLowerCase();
  }
}
