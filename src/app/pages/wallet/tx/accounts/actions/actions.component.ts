import { Component, Input, OnInit } from '@angular/core';

import { PopoverController } from '@ionic/angular';
import { PublicKey, TransactionInstruction, WithdrawStakeParams } from '@solana/web3.js';
import { StakeAccountExtended, toastData } from 'src/app/models';
import { SolanaUtilsService, ToasterService, TxInterceptService } from 'src/app/services';
import { MergeAccountsPopupComponent } from '../merge-accounts-popup/merge-accounts-popup.component';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
})
export class ActionsComponent implements OnInit {
  @Input() account: StakeAccountExtended;
  @Input() accounts: StakeAccountExtended[];
  @Input() wallet;
  constructor(
    private _txInterceptService: TxInterceptService,
    private _popoverController: PopoverController,
    private _solanaUtilsService: SolanaUtilsService,
    private _toasterService: ToasterService,
  ) { }

  ngOnInit() {

  }

  public async deactiveStake(stakeAccount: StakeAccountExtended): Promise<void> {
    await this._txInterceptService.deactivateStakeAccount(stakeAccount.addr, this.wallet.publicKey);
  }
  public async withdrawStake(stakeAccount: StakeAccountExtended) {
    let stakeBalance = await this._solanaUtilsService.connection.getBalance(new PublicKey(stakeAccount.addr));
    const stakeAccountAddress = stakeAccount.addr
    this._txInterceptService.withdrawFromStakeAccount(stakeAccountAddress, this.wallet.publicKey, stakeBalance)
  }
  public reStake(stakeAccount: StakeAccountExtended) {
    this._txInterceptService.delegateStakeAccount(stakeAccount, this.wallet.publicKey);
  }
  public claimMEV(stakeAccount: StakeAccountExtended) {
    if (stakeAccount.excessLamport > 0) {
      this._txInterceptService.withdrawFromStakeAccount(stakeAccount.addr, this.wallet.publicKey, stakeAccount.excessLamport)
    }else {
      const toast: toastData ={
        message: 'No excess lamport',
        segmentClass: 'toastError'
      }
      this._toasterService.msg.next(toast)
    }

  }
  public splitStake() { }
  async openMergeAccountPopup() {
    if (this.account.state == 'active') {

      const popover = await this._popoverController.create({
        component: MergeAccountsPopupComponent,
        componentProps: { account: this.account, wallet: this.wallet, accounts: this.accounts },
        // event: e,
        alignment: 'start',
        // showBackdrop:false,
        backdropDismiss: true,
        // dismissOnSelect: true,
        cssClass: 'merge-accounts-popup',
      });
      await popover.present();
    } else {
      const toast: toastData ={
        message: 'Available for active stake accounts only',
        segmentClass: 'toastError'
      }
      this._toasterService.msg.next(toast)
    }
  }
}
