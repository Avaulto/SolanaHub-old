import { Component, OnInit } from '@angular/core';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { Marinade, MarinadeConfig } from '@marinade.finance/marinade-ts-sdk'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

import { firstValueFrom, map, Observable, shareReplay, Subject, switchMap } from 'rxjs';
import { StakeAccountExtended } from 'src/app/models';

import { stakePoolInfo } from '@solana/spl-stake-pool';
import { StakePoolProvider, StakePoolStats } from './stake-pool.model';
import { environment } from 'src/environments/environment';
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
      if(this.wallet){
      
        this.initProviderSDK(this.currentProvider)
      }
      return provider
    }))
  public stakeAccounts: Observable<StakeAccountExtended[]> = this._walletStore.anchorWallet$.pipe(
    this._utilService.isNotNull,
    this._utilService.isNotUndefined,
    switchMap(async (wallet) => {
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
  public async initProviderSDK(currentProvider) {
    try {
      if (currentProvider.name.toLowerCase() == 'solblaze') {
        let info = await this.stakePoolStore.stakePoolSDK.stakePoolInfo(this._solanaUtilsService.connection, currentProvider.poolpubkey);
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


  ionViewWillEnter() {
    this.initConfigStartup();
  }
  // setup query params from URL
  initConfigStartup() {
    this._activeRoute.queryParams
      .subscribe(params => {
        const _params = this.toLower(params);
        let { pool, stakingtype } = _params
        const provider = this.stakePoolStore.providers.find(avaiablePool => avaiablePool.name.toLowerCase() === pool.toLowerCase())
        if (provider) {

          this.stakePoolStore.selectProvider(provider)

        }
        if(stakingtype){
          if (stakingtype.toLowerCase()  == 'sol' || stakingtype.toLowerCase() == 'stake-account') {
            this.selectStakePath(stakingtype.toLowerCase())
          }
        }
      }
      );
  }
   toLower(params: Params): Params {
    const lowerParams: Params = {};
    for (const key in params) {
        lowerParams[key.toLowerCase()] = params[key];
    }

    return lowerParams;
}


  public stakingType: 'sol' | 'stake-account' = 'sol'
  public selectStakePath(option: 'sol' | 'stake-account'): void {
    this.stakingType = option
  }


}
