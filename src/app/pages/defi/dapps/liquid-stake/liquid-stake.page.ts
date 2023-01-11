import { Component, OnInit, ViewChild } from '@angular/core';
import { WalletConfig, WalletStore, Wallet } from '@heavy-duty/wallet-adapter';
import { Marinade, MarinadeConfig, Provider } from '@marinade.finance/marinade-ts-sdk'
import { LAMPORTS_PER_SOL, PublicKey, Transaction } from '@solana/web3.js';
import { SolanaUtilsService } from 'src/app/services/solana-utils.service';
import bn from 'bn.js'
import { UtilsService, TxInterceptService } from 'src/app/services';
import { distinctUntilChanged, filter, map, Observable, shareReplay, Subject, switchMap } from 'rxjs';
import { StakeAccountExtended } from 'src/app/models';


// const { Connection, Transaction, Keypair, SystemProgram, PublicKey, LAMPORTS_PER_SOL, sendAndConfirmRawTransaction, TransactionInstruction } = solanaWeb3;
// const { getStakePoolAccount, updateStakePool, depositSol, depositStake, withdrawSol, withdrawStake, stakePoolInfo } = solanaStakePool;

import { getStakePoolAccount, updateStakePool, depositSol, depositStake, withdrawSol, withdrawStake, stakePoolInfo } from '@solana/spl-stake-pool';
import { StakePoolProvider, StakePoolStats } from './stake-pool.model';
import { environment } from 'src/environments/environment';


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
    name: 'marinade',
    image: 'assets/images/icons/marinade-logo-small.svg',
    mintAddress:'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So',
    ticker: 'mSOL'
  },
  {
    name: 'solblaze',
    image: 'assets/images/icons/solblaze-logo.png',
    poolpubkey: new PublicKey(environment.solblazepool),
    mintAddress:'bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1',
    ticker: 'bSOL'
  }
  ]
  public currentProvider: Subject<StakePoolProvider> = new Subject();
  public subCurrentProvider = this.currentProvider.asObservable().pipe(shareReplay(1))
  provider = null
  public marinade: Marinade;
  public stakePoolStats: StakePoolStats;
  public wallet;
  public solBalance = 0;
  public stakeAccounts: Observable<StakeAccountExtended[]> = this._walletStore.anchorWallet$.pipe(
    this._utilService.isNotNull,
    this._utilService.isNotUndefined,
    switchMap(async (wallet) => {
      if (wallet) {
        const stakeAccounts = await this._solanaUtilsService.getStakeAccountsByOwner(wallet.publicKey);
        const extendStakeAccount = await stakeAccounts.map(async (acc) => {
          const { shortAddr, addr, balance, state } = await this._solanaUtilsService.extendStakeAccount(acc)
          let selectable: boolean = false;
          // remove account that have less then 2sol - marinade program not support
          if (balance > 1 && state == 'active') {
            selectable = true
          }
          return { name: shortAddr, addr, selectable, extraData: { balance, state, selectable } };
        })
        const extendStakeAccountRes = await Promise.all(extendStakeAccount);
        return extendStakeAccountRes;
      } else {
        return null
      }
    }),
    //  filter((res: any[]) => res.length > 0),
    distinctUntilChanged()
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


    this._walletStore.anchorWallet$.subscribe(async wallet => {
      if (wallet) {
        this.wallet = wallet;
        this.solBalance = this._utilService.shortenNum(((await this._solanaUtilsService.connection.getBalance(this.wallet.publicKey)) / LAMPORTS_PER_SOL));
        // this.initSPProvider(provider)
        //const splAccounts = await this.solanaUtilsService.getTokensAccountbyOwner(this.wallet.publicKey);
      }
    })
  }
  /** @SP = reffer as stake pool */
  async initSPProvider(SP: StakePoolProvider) {
    if (SP.name == 'solBlaze') {
      let info = await stakePoolInfo(this._solanaUtilsService.connection, SP.poolpubkey);
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
