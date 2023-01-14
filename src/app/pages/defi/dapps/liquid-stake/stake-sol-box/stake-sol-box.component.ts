import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
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
export class StakeSolBoxComponent implements OnChanges {
  @Input() selectedProvider: StakePoolProvider;
  @Input() stakePoolStats: StakePoolStats;
  @Input() marinade: Marinade;
  @Input() solBalance: number = 0;
  @Input() wallet;
  formSubmitted: boolean = false;
  stakeAmount: number;
  unStakeAmount: number;
  public segmentUtilTab: string = 'stake'
  constructor(
    private _solanaUtilsService: SolanaUtilsService,
    private _txInterceptService: TxInterceptService,
    private _walletStore: WalletStore,
    private _utilsService: UtilsService
  ) { }

  async ngOnChanges() {

  }
  setUtil(util: string) {
    this.segmentUtilTab = util;
  }
  setMaxAmountSOL() {
    this.stakeAmount = this._utilsService.shortenNum(this.solBalance - 0.0001);
    // console.log(this.stakeAmount, this.solBalance)
  }
  setMaxAmountxSOL() {
    this.unStakeAmount = this.stakePoolStats.userHoldings.staked_asset
  }
  async liquidStake() {
    trackEvent('liquid stake ' + this.selectedProvider.name)
    const amount: number = Number(this.stakeAmount);
    const sol = new bn(amount * LAMPORTS_PER_SOL);
    if (this.selectedProvider.name.toLowerCase() == 'marinade') {
      const { transaction } = await this.marinade.deposit(sol);
      this._txInterceptService.sendTx([transaction], this.wallet.publicKey)
    } else {
      let depositTx = await depositSol(
        this._solanaUtilsService.connection,
        this.selectedProvider.poolpubkey,
        this.wallet.publicKey,
        Number(sol)
      );
      this._txInterceptService.sendTx(depositTx.instructions, this.wallet.publicKey, depositTx.signers)
    }

    // console.log(signature)
  }
  public async liquidUnstake() {
    const sol = new bn(this.unStakeAmount * LAMPORTS_PER_SOL);
    if (this.selectedProvider.name.toLowerCase() == 'marinade') {
      const { transaction } = await this.marinade.liquidUnstake(sol)

      // sign and send the `transaction`
      this._txInterceptService.sendTx([transaction], this.wallet.publicKey)
    } else {
      let withdrawTx = await withdrawStake(
        this._solanaUtilsService.connection,
        this.selectedProvider.poolpubkey,
        this.wallet.publicKey,
        this.unStakeAmount,
        false
      );
      this._txInterceptService.sendTx(withdrawTx.instructions, this.wallet.publicKey, withdrawTx.signers)

    }
  }
}
