import { Component, OnDestroy, OnInit } from '@angular/core';


import { WalletStore } from '@heavy-duty/wallet-adapter';
import { ApiService, SolanaUtilsService, UtilsService } from 'src/app/services';

import { OrcaWhirlPool, Whirlpool, WhirlPoolsStats } from './orca.model';
import { formatCurrency } from '@angular/common';
import { catchError, firstValueFrom, map, Observable, shareReplay, Subscription, switchMap, takeUntil, tap } from 'rxjs';

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
    shareReplay(),
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
  public wallet$: Subscription;

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
  tabChange(ev){
    this.currentTab = ev
    this.searchTerm = ''
  }
}
