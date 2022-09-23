import { Component, OnInit, ViewChild } from '@angular/core';
import { WalletConfig, WalletStore, Wallet } from '@heavy-duty/wallet-adapter';
import { Marinade, MarinadeConfig, Provider } from '@marinade.finance/marinade-ts-sdk'
import { LAMPORTS_PER_SOL, PublicKey, Transaction } from '@solana/web3.js';
import { SolanaUtilsService } from 'src/app/services/solana-utils.service';
import bn from 'bn.js'
import { UtilsService, TxInterceptService } from 'src/app/services';
import { distinctUntilChanged, filter, map, Observable, switchMap } from 'rxjs';
import { StakeAccountExtended } from 'src/app/models';


@Component({
  selector: 'app-liquid-stake',
  templateUrl: './liquid-stake.page.html',
  styleUrls: ['./liquid-stake.page.scss'],
})
export class LiquidStakePage implements OnInit {

  public marinade: Marinade;
  public marinadeInfo;  
  public wallet;
  public stakeAccountsLength: Observable<StakeAccountExtended[]> = this._walletStore.anchorWallet$.pipe(
    switchMap(async (wallet) => {
      const stakeAccounts = await this._solanaUtilsService.getStakeAccountsByOwner(wallet.publicKey);
      return stakeAccounts.length
    }),
    //  filter((res: any[]) => res.length > 0),
    distinctUntilChanged()
  )
  public solBalance = 0;
  constructor(
    private _solanaUtilsService: SolanaUtilsService,
    private _txInterceptService: TxInterceptService,
    private _walletStore: WalletStore,
    private _utilService: UtilsService
  ) { }


  async ngOnInit() {
    this._walletStore.anchorWallet$.subscribe(async wallet => {
      if (wallet) {
        this.wallet = wallet;
        this.solBalance = this._utilService.shortenNum(((await this._solanaUtilsService.connection.getBalance(this.wallet.publicKey)) / LAMPORTS_PER_SOL));
        this.initMarinade();
        //const splAccounts = await this.solanaUtilsService.getTokensAccountbyOwner(this.wallet.publicKey);
      }
    })
  }


  async initMarinade(): Promise<void> {
    const config = new MarinadeConfig({
      connection: this._solanaUtilsService.connection,
      publicKey: this.wallet.publicKey
    })
    this.marinade = new Marinade(config)
    const state = await this.marinade.getMarinadeState();
    // console.log(this.marinade.depositStakeAccount , state)
  }


  public stakePate: 'sol' | 'stakeAcc' = 'sol'
  public selectStakePath(option: 'sol' | 'stakeAcc'): void{
    this.stakePate = option
  }

}
