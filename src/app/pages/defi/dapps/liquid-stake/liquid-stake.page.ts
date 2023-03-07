import { Component, OnInit } from '@angular/core';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { Marinade, MarinadeConfig } from '@marinade.finance/marinade-ts-sdk'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

import { combineLatestWith, firstValueFrom, map, Observable, shareReplay, Subject, Subscriber, Subscription, switchMap } from 'rxjs';
import { StakeAccountExtended } from 'src/app/models';
import { StakePoolProvider, StakePoolStats } from './stake-pool.model';
import { ActivatedRoute, Params } from '@angular/router';
import { StakePoolStoreService } from './stake-pool-store.service';
import { SolanaUtilsService, UtilsService } from 'src/app/services';


@Component({
  selector: 'app-liquid-stake',
  templateUrl: './liquid-stake.page.html',
  styleUrls: ['./liquid-stake.page.scss'],
})
export class LiquidStakePage {

  constructor(
    public stakePoolStore: StakePoolStoreService,
    private _solanaUtilsService: SolanaUtilsService,
    // private _apiService: ApiService,
    private _walletStore: WalletStore,
    private _utilService: UtilsService,
    private _activeRoute: ActivatedRoute
  ) { }

  public marinade: Marinade = this.stakePoolStore.marinadeSDK;
  public stakePoolStats: StakePoolStats;
  public wallet;
  public solBalance = 0;
  public Apy: number = null;
  public currentProvider: StakePoolProvider = null;
  public provider$ = this.stakePoolStore.provider$.pipe(
    this._utilService.isNotNull,
    this._utilService.isNotUndefined,
    map((provider) => {
      this.currentProvider = provider
      if (this.wallet) {

        this.initProviderSDK(this.currentProvider)
      }
      return provider
    }))
  public stakeAccounts: Observable<StakeAccountExtended[]> = this._walletStore.anchorWallet$.pipe(
    combineLatestWith(this._solanaUtilsService.accountChange$),
    this._utilService.isNotNull,
    this._utilService.isNotUndefined,
    // accountStateChange used as trigger for re-render wallet related context
    switchMap(async ([wallet, accountStateChange]: any) => {
      this.wallet = wallet;
      this.solBalance = ((await this._solanaUtilsService.connection.getBalance(this.wallet.publicKey)) / LAMPORTS_PER_SOL);
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

    }),
    shareReplay(1)
  )
  public async initProviderSDK(currentProvider:StakePoolProvider) {
    try {
      if (currentProvider.poolName.toLowerCase() != 'marinade') {
        let info = await this.stakePoolStore.stakePoolSDK.stakePoolInfo(this._solanaUtilsService.connection, currentProvider.poolPublicKey);
        if (info.details.updateRequired) {
          await this.stakePoolStore.updateSolBlazePool();
        }
      } else {
        this.stakePoolStore.initMarinade(this.wallet);
        this.marinade = this.stakePoolStore.marinadeSDK
      }
    } catch (error) {
      console.warn(error);
    }
  }

  private _queryParam$: Subscription;
  ionViewWillEnter() {
   this._queryParam$ = this.initConfigStartup();
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
