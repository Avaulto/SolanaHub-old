import { Component, OnInit } from '@angular/core';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { Marinade, MarinadeConfig } from '@marinade.finance/marinade-ts-sdk'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { SolanaUtilsService } from 'src/app/services/solana-utils.service';

import { UtilsService, TxInterceptService } from 'src/app/services';
import {  Observable, shareReplay, Subject, switchMap } from 'rxjs';
import { StakeAccountExtended } from 'src/app/models';

import {  stakePoolInfo } from '@solana/spl-stake-pool';
import { StakePoolProvider, StakePoolStats } from './stake-pool.model';
import { environment } from 'src/environments/environment.prod';


@Component({
  selector: 'app-liquid-stake',
  templateUrl: './liquid-stake.page.html',
  styleUrls: ['./liquid-stake.page.scss'],
})
export class LiquidStakePage implements OnInit {
  // solblaze tx fee covrage from users
  private SOLPAY_API_ACTIVATION = new PublicKey("7f18MLpvAp48ifA1B8q8FBdrGQhyt9u5Lku2VBYejzJL");

  // avaliable stake pool providers to select
  protected providers: StakePoolProvider[] = [{
    name: 'Marinade',
    image: 'assets/images/icons/marinade-logo-small.svg',
    mintAddress: 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So',
    ticker: 'mSOL'
  },
  {
    name: 'SolBlaze',
    image: 'assets/images/icons/solblaze-logo.png',
    poolpubkey: new PublicKey(environment.solblazepool),
    mintAddress: 'bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1',
    ticker: 'bSOL'
  }
  ]
  public currentProvider: Subject<StakePoolProvider> = new Subject();
  public subCurrentProvider = this.currentProvider.asObservable().pipe(shareReplay(1))
  public provider: StakePoolProvider = null
  public marinade: Marinade;
  public stakePoolStats: StakePoolStats;
  public wallet;
  public solBalance = 0;
  public stakeAccounts: Observable<StakeAccountExtended[]> = this._walletStore.anchorWallet$.pipe(
    this._utilService.isNotNull,
    this._utilService.isNotUndefined,
    switchMap(async (wallet) => {
      this.wallet = wallet;
      this.solBalance = this._utilService.shortenNum(((await this._solanaUtilsService.connection.getBalance(this.wallet.publicKey)) / LAMPORTS_PER_SOL));
      if (this.provider) {
        this.initSPProvider(this.provider)
      }
      const stakeAccounts = await this._solanaUtilsService.getStakeAccountsByOwner(wallet.publicKey);
      const extendStakeAccount = await stakeAccounts.map(async (acc) => {
        const { shortAddr, addr, balance, state, validatorData } = await this._solanaUtilsService.extendStakeAccount(acc)
        let selectable: boolean = false;
        // remove account that have less then 2sol - program not support
        if (balance > 1 && state == 'active') {
          selectable = true
        }
        let extraData: any =  { balance, selectable }
        if(validatorData){
          extraData.validatorName = validatorData.name;
        }
        return { name: shortAddr, addr, selectable, validatorData, extraData };
      })
      const extendStakeAccountRes = await Promise.all(extendStakeAccount);
      return extendStakeAccountRes;

    }),
    shareReplay(1)
  )
  constructor(
    private _solanaUtilsService: SolanaUtilsService,
    private _txInterceptService: TxInterceptService,
    private _walletStore: WalletStore,
    private _utilService: UtilsService
  ) { }

  private updateSolBlazePool(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await (await fetch(
          "https://stake.solblaze.org/api/v1/update_pool?network=mainnet-beta"
        )).json();
        if (result.success) {
          resolve();
        } else {
          reject();
        }
      } catch (err) {
        reject();
      }
    });
  }
  async ngOnInit() {
    this.currentProvider.subscribe((provider: StakePoolProvider) => {
      this.provider = provider;
    })
  }
  /** @SP = reffer as stake pool */
  async initSPProvider(selectedProvider: StakePoolProvider) {
    if (selectedProvider.name.toLowerCase() == 'solBlaze') {
      let info = await stakePoolInfo(this._solanaUtilsService.connection, selectedProvider.poolpubkey);
      if (info.details.updateRequired) {
        await this.updateSolBlazePool();
      }
    } else {
      this.initMarinade();
    }
  }
  async initMarinade(): Promise<void> {
    const config = new MarinadeConfig({
      connection: this._solanaUtilsService.connection,
      publicKey: this.wallet.publicKey,
      // referralCode: new PublicKey('9CLFBo1nsG24DNoVZvsSNEYRNGU1LAHGS5M3o9Ei33o6'),
    })
    this.marinade = new Marinade(config)
    const state = await this.marinade.getMarinadeState();
    // console.log(this.marinade.depositStakeAccount , state)
  }


  public stakePath: 'sol' | 'stakeAcc' = 'sol'
  public selectStakePath(option: 'sol' | 'stakeAcc'): void {
    this.stakePath = option
  }

  selectProvider(provider: StakePoolProvider) {
    this.currentProvider.next(provider)
  }
}
