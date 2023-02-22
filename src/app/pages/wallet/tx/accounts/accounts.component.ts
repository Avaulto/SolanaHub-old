import { Component, Input, OnChanges } from '@angular/core';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { PopoverController } from '@ionic/angular';
import { Asset, StakeAccountExtended } from 'src/app/models';
import { LoaderService, SolanaUtilsService, TxInterceptService } from 'src/app/services';
import { ActionsComponent } from './actions/actions.component';
@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnChanges {
 
  public stakeAccounts$ = this._solanaUtilsService.stakeAccounts$;
  public stakeAccountStatic = null;

  @Input() wallet: any;
  constructor(
    public loaderService: LoaderService,
    private _solanaUtilsService: SolanaUtilsService,
    private _txInterceptService: TxInterceptService,
    private _walletStore: WalletStore,
    private _popoverController: PopoverController
  ) { }

  public async ngOnChanges(){
    // automatic update when account has change
    if (this.wallet) {
      this._solanaUtilsService.fetchAndUpdateStakeAccount(this.wallet.publicKey);
      this._solanaUtilsService.onAccountChangeCB(this.wallet.publicKey)
    }

  }

  public getStatusColor(status: 'active' | 'inactive' | 'activating' | 'deactivating') {
    switch (status) {
      case 'active':
        return '#13CFC6'
        break;
      case 'inactive':
        return '#FE5B5B'
        break;
      case 'activating':
        return '#FBBC05'
        break;
      default:
        return '#FE5B5B'
        break;
    }
  }

  async openStakeAccountActions(e: Event, account: StakeAccountExtended, accounts:StakeAccountExtended[]) {
    const popover = await this._popoverController.create({
      component: ActionsComponent,
      componentProps:{account,wallet:this.wallet, accounts},
      event: e,
      alignment: 'start',
      showBackdrop:false,
      backdropDismiss: true,
      dismissOnSelect: true,
      cssClass: 'stake-account-actions-popup',
    });
    await popover.present();
  }


}
