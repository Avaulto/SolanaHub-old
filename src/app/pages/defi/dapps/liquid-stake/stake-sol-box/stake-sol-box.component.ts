import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { WalletConfig, WalletStore, Wallet } from '@heavy-duty/wallet-adapter';
import { Marinade, MarinadeConfig, Provider } from '@marinade.finance/marinade-ts-sdk'
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { SolanaUtilsService, TxInterceptService, UtilsService } from 'src/app/services';
import bn from 'bn.js'

import Plausible from 'plausible-tracker'
import { StakePoolProvider, StakePoolStats } from '../stake-pool.model';
import { depositSol, withdrawSol, withdrawStake } from '@solana/spl-stake-pool';
const { trackEvent } = Plausible();


@Component({
  selector: 'app-stake-sol-box',
  templateUrl: './stake-sol-box.component.html',
  styleUrls: ['./stake-sol-box.component.scss'],
})
export class StakeSolBoxComponent implements OnInit {
  @Input() selectedProvider: StakePoolProvider;
  @Input() stakePoolStats: StakePoolStats;
  @Input() marinade: Marinade;
  formSubmitted: boolean = false;
  stakeAmount: number;
  unStakeAmount: number;
  public segmentUtilTab: string = 'stake'
  public wallet;
  public solBalance: number = 0;
  public xSOLBalance: number = 0;
  constructor(
    private _solanaUtilsService: SolanaUtilsService,
    private _txInterceptService: TxInterceptService,
    private _walletStore: WalletStore,
    private _utilsService: UtilsService
  ) { }

  async ngOnInit() {
    this._walletStore.anchorWallet$.subscribe(async wallet => {
      if (wallet) {
        this.wallet = wallet;
        this.solBalance = this._utilsService.shortenNum(((await this._solanaUtilsService.connection.getBalance(this.wallet.publicKey)) / LAMPORTS_PER_SOL));
        const splAccounts = await this._solanaUtilsService.getTokenAccountsBalance(this.wallet.publicKey) || [];
        const splAccount = splAccounts.find(account => account.mintAddress == this.selectedProvider.mintAddress);
        if (splAccount) {
          this.xSOLBalance = splAccount?.balance < 0.01 ? 0 : splAccount.balance;
        } else {
          this.xSOLBalance = 0;
        }
      }
    })
  }
  setUtil(util: string) {
    this.segmentUtilTab = util;
  }
  setMaxAmountSOL() {
    this.stakeAmount = this._utilsService.shortenNum(this.solBalance - 0.0001);
    // console.log(this.stakeAmount, this.solBalance)
  }
  setMaxAmountxSOL() {
    this.unStakeAmount = this.xSOLBalance;
  }
  async liquidStake() {
    trackEvent('liquid stake ' + this.selectedProvider.name)
    const amount: number = Number(this.stakeAmount);
    const sol = new bn(amount * LAMPORTS_PER_SOL);
    if (this.selectedProvider.name == 'marinade') {
      const {
        associatedMSolTokenAccountAddress,
        transaction,
      } = await this.marinade.deposit(sol);
      this._txInterceptService.sendTx([transaction], this.wallet.publicKey)
    } else {
      let depositTx = await depositSol(
        this._solanaUtilsService.connection,
        this.selectedProvider.poolpubkey,
        this.wallet.publicKey,
        Number(sol)
      );
      // let transaction = new Transaction();
      // transaction.add(SystemProgram.transfer({
      //   fromPubkey: this.wallet,
      //   toPubkey: SOLPAY_API_ACTIVATION,
      //   lamports: 5000
      // }));
      // transaction.add(...depositTx.instructions);
      this._txInterceptService.sendTx(depositTx.instructions, this.wallet.publicKey, depositTx.signers)
    }

    // console.log(signature)
  }
  public async liquidUnstake() {
    const sol = new bn(this.unStakeAmount * LAMPORTS_PER_SOL);
    if (this.selectedProvider.name == 'marinade') {
      const {
        associatedMSolTokenAccountAddress,
        transaction,
      } = await this.marinade.liquidUnstake(sol)
      // sign and send the `transaction`
      this._txInterceptService.sendTx([transaction], this.wallet.publicKey)
    } else {
      let withdrawTx = await withdrawSol(
        this._solanaUtilsService.connection,
        this.selectedProvider.poolpubkey,
        this.wallet.publicKey,
        this.wallet.publicKey,
        this.unStakeAmount,
      );
      this._txInterceptService.sendTx(withdrawTx.instructions, this.wallet.publicKey, withdrawTx.signers)

    }
  }
}
