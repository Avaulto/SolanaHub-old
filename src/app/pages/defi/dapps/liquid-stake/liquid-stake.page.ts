import { Component } from '@angular/core';

import {  map, Observable, shareReplay, Subject, Subscriber, Subscription, switchMap } from 'rxjs';
import { StakeAccountExtended, WalletExtended } from 'src/app/models';
import { StakePoolProvider, StakePoolStats } from './stake-pool.model';
import { ActivatedRoute, Params } from '@angular/router';
import { StakePoolStoreService } from './stake-pool-store.service';
import { SolanaUtilsService, UtilsService } from 'src/app/services';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-liquid-stake',
  templateUrl: './liquid-stake.page.html',
  styleUrls: ['./liquid-stake.page.scss'],
})
export class LiquidStakePage {

  constructor(
    public stakePoolStore: StakePoolStoreService,
    private _solanaUtilsService: SolanaUtilsService,
    private _titleService: Title,  
    private _utilService: UtilsService,
    private _activeRoute: ActivatedRoute
  ) { 
  }

  public stakePoolsInfo: StakePoolProvider[] = [];
  public stakePoolStats: StakePoolStats;
  public wallet;
  public solBalance = 0;
  public Apy: number = null;
  public currentProvider: StakePoolProvider = null;
  public tip: string;
  public provider$ = this.stakePoolStore.provider$.pipe(
    this._utilService.isNotNull,
    this._utilService.isNotUndefined,
    map((provider) => {
      this.currentProvider = provider
      this.tip = `
      SOL/${provider.tokenSymbol} exchange rate is determined by a formula:
                                POOL SOL staked / current ${provider.tokenSymbol} supply. Because staked SOL is earning yield, 
                                it grows in size vs. ${provider.tokenSymbol} over time. When you swap ${provider.tokenSymbol} back to SOL,
                                 you receive more SOL than you staked/swapped before.
                                 `
      if (this.wallet) {

        this.initProviderSDK(this.currentProvider)
      }
      return provider
    }))
  public stakeAccounts$: Observable<StakeAccountExtended[]> = this._solanaUtilsService.walletExtended$.pipe(
   
    // accountStateChange used as trigger for re-render wallet related context
    switchMap(async (wallet: WalletExtended) => {
      if (wallet) {
        this.wallet = wallet;
        this.solBalance = wallet.balance
        if (this.currentProvider) {
          this.initProviderSDK(this.currentProvider)
        }
        const stakeAccounts = await this._solanaUtilsService.getStakeAccountsByOwner(wallet.publicKey);
        const extendStakeAccount = await stakeAccounts.map(async (acc) => {
          const { shortAddr, addr, balance, state, validatorData } = await this._solanaUtilsService.extendStakeAccount(acc)
          let selectable: boolean = false;
          // remove account that have less then 2sol - program not support
          if (balance > 1 && state == 'active') {
            selectable = true
          }
          let extraData: any = { balance, selectable }
          if (validatorData) {
            extraData['validator name'] = validatorData.name;
          }
          return { name: shortAddr, addr, selectable, validatorData, extraData };
        })
        const extendStakeAccountRes = await Promise.all(extendStakeAccount);
        return extendStakeAccountRes;
      }else{
        return null
      }
    }),
    shareReplay(1)
  )
  public async initProviderSDK(currentProvider: StakePoolProvider) {
    try {
      if (currentProvider.poolName.toLowerCase() != 'marinade') {
        let info = await this.stakePoolStore.stakePoolSDK.stakePoolInfo(this._solanaUtilsService.connection, currentProvider.poolPublicKey);

        if (info.details.updateRequired) {
          await this.stakePoolStore.updateSolBlazePool();
        }
      } else {
        this.stakePoolStore.initMarinade(this.wallet);
      }
    } catch (error) {
      console.warn(error);
    }
  }

  private _queryParam$: Subscription;
  async ionViewWillEnter() {
    this._titleService.setTitle('CompactDeFi - Liquid staking')
    this._queryParam$ = this.initConfigStartup();
    await this.stakePoolStore.getStakePoolsInfo()
  }
  ionViewWillLeave() {
    this._queryParam$.unsubscribe();
  }
  // setup query params from URL
  initConfigStartup() {
    return this._activeRoute.queryParams
      .subscribe(params => {
        if (Object.keys(params).length) {
          const _params = this._utilService.toLower(params);
          let { pool, type } = _params
          const provider = this.stakePoolStore.providers.find(avaiablePool => avaiablePool.poolName.toLowerCase() === pool.toLowerCase())
          if (provider) {

            this.stakePoolStore.selectProvider(provider)

          }
          if (type) {
            if (type.toLowerCase() == 'sol' || type.toLowerCase() == 'account') {
              this.selectStakePath(type.toLowerCase())
            }
          }
        }
      }
      );

  }



  public stakingType: 'sol' | 'account' = 'sol'
  public selectStakePath(option: 'sol' | 'account'): void {
    this.stakingType = option
  }


}
