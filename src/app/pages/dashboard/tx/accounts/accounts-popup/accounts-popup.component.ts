import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonCheckbox, PopoverController } from '@ionic/angular';
import { AuthorizeStakeParams, PublicKey, StakeProgram } from '@solana/web3.js';

import { StakeAccountExtended } from 'src/app/models';
import { SolanaUtilsService, TxInterceptService } from 'src/app/services';
import va from '@vercel/analytics';
@Component({
  selector: 'app-accounts-popup',
  templateUrl: './accounts-popup.component.html',
  styleUrls: ['./accounts-popup.component.scss'],
})
export class AccountsPopupComponent implements OnInit {
  @Input() account: StakeAccountExtended;
  @Input() accounts: StakeAccountExtended[];
  @Input() wallet
  @Input() actionType: 'merge' | 'transferAuth';
  public accountsToMerge: StakeAccountExtended[]
  public selectedAccounts =[]
  public transferAssetForm: FormGroup;
  constructor(
    private _txInterceptService: TxInterceptService,
     private _popoverController:PopoverController,
     private _fb: FormBuilder
     ) { }

  ngOnInit() {
    // merge setup
    if(this.actionType == 'merge'){
      this.accountsToMerge = this._avaliableToMerge()
    }

    // transfer stake account auth setup
    if(this.actionType == 'transferAuth'){
      this.transferAssetForm = this._fb.group({
        authrizedPubkey: ['', [Validators.required]]
      })
    }
  }
  private _avaliableToMerge(): StakeAccountExtended[]{
    // filter account for merge conditions(active stake & same validator)
    const filterAccounts = this.accounts.filter(acc => {
      if(acc.addr != this.account.addr && acc.validatorVoteKey == this.account.validatorVoteKey && acc.state == 'active'){
        return acc
      }
    })
    return filterAccounts;
  }
  public storeSelection(accountData: {account:StakeAccountExtended, accCheckbox}){
    if(accountData.accCheckbox.el.checked){
      this.selectedAccounts.push(accountData.account)
    }else{
      const filterAcc = this.selectedAccounts.filter((account:StakeAccountExtended) => account.addr == accountData.account.addr)
      this.selectedAccounts = filterAcc;
    }
  }
  public async submit(): Promise<void> {
    const walletOwner = this.wallet.publicKey
    const accountTarget = new PublicKey(this.account.addr)
    this._popoverController.dismiss();
    if(this.actionType == 'merge'){
      const stakeAccountsSource: PublicKey[] = this.selectedAccounts.map(account => new PublicKey(account.addr));
      await this._txInterceptService.mergeStakeAccounts(walletOwner, stakeAccountsSource, accountTarget);
      va.track('account actions',{type: 'merge stake accounts'});
    }
    if(this.actionType == 'transferAuth'){
      const authrizedPubkey = new PublicKey(this.transferAssetForm.value.authrizedPubkey)
      await this._txInterceptService.transferStakeAccountAuth(accountTarget ,walletOwner, authrizedPubkey);
      va.track('account actions',{type: 'transfer authority'});
    }
  }

}
