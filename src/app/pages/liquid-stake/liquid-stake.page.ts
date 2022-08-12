import { Component, OnInit, ViewChild } from '@angular/core';
import { WalletConfig, WalletStore, Wallet } from '@heavy-duty/wallet-adapter';
import { Marinade, MarinadeConfig, Provider } from '@marinade.finance/marinade-ts-sdk'
import { LAMPORTS_PER_SOL, PublicKey, Transaction } from '@solana/web3.js';
import { SolanaUtilsService } from 'src/app/services/solana-utils.service';
import bn from 'bn.js'
import { TxInterceptService } from 'src/app/services/txIntercept.service';
import { UtilsService } from 'src/app/services';
import { StakeAccountExtended } from 'src/app/shared/models/stakeAccountData.model';
import { distinctUntilChanged, filter, map, Observable, switchMap } from 'rxjs';


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
      const stakeAccounts = await this.solanaUtilsService.getStakeAccountsByOwner(wallet.publicKey);
      return stakeAccounts.length
    }),
    //  filter((res: any[]) => res.length > 0),
    distinctUntilChanged()
  )
  public solBalance = 0;
  constructor(
    private solanaUtilsService: SolanaUtilsService,
    private txInterceptService: TxInterceptService,
    private _walletStore: WalletStore,
    private utilsService: UtilsService
  ) { }


  async ngOnInit() {
    this._walletStore.anchorWallet$.subscribe(async wallet => {
      if (wallet) {
        this.wallet = wallet;
        this.solBalance = this.utilsService.shortenNum(((await this.solanaUtilsService.connection.getBalance(this.wallet.publicKey)) / LAMPORTS_PER_SOL));
        this.initMarinade();
        //const splAccounts = await this.solanaUtilsService.getTokensAccountbyOwner(this.wallet.publicKey);
      }
    })
  }


  async initMarinade(): Promise<void> {
    const config = new MarinadeConfig({
      connection: this.solanaUtilsService.connection,
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
