import { Component, Input, OnInit } from '@angular/core';
import { IonCheckbox, PopoverController } from '@ionic/angular';
import { PublicKey } from '@solana/web3.js';
import { StakeAccountExtended } from 'src/app/models';
import { SolanaUtilsService, TxInterceptService } from 'src/app/services';

@Component({
  selector: 'app-merge-accounts-popup',
  templateUrl: './merge-accounts-popup.component.html',
  styleUrls: ['./merge-accounts-popup.component.scss'],
})
export class MergeAccountsPopupComponent implements OnInit {
  @Input() account: StakeAccountExtended;
  @Input() accounts: StakeAccountExtended[];
  @Input() wallet
  public accountsToMerge: StakeAccountExtended[]
  public selectedAccounts =[]
  constructor(
    private _txInterceptService: TxInterceptService,
     private _popoverController:PopoverController,
     private _solanaUtilsService: SolanaUtilsService,
     ) { }

  ngOnInit() {
    this.accountsToMerge = this._avaliableToMerge()
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
  public async mergeAccounts(): Promise<void> {
    const walletOwner = this.wallet.publicKey
    const stakeAccountsSource: PublicKey[] = this.selectedAccounts.map(account => new PublicKey(account.addr));
    const accountTarget = new PublicKey(this.account.addr)
    this._popoverController.dismiss();
    await this._txInterceptService.mergeStakeAccounts(walletOwner, stakeAccountsSource, accountTarget);
    this._solanaUtilsService.fetchAndUpdateStakeAccount(this.wallet.publicKey);
  }
}
