import { Component, Input, OnChanges } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { of, switchMap } from 'rxjs';
import { Asset, StakeAccountExtended } from 'src/app/models';
import { LoaderService, SolanaUtilsService, TxInterceptService } from 'src/app/services';
import { ActionsComponent } from './actions/actions.component';
@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnChanges {
  @Input()privateValidatorPage: boolean = false;
  private AvaultoVoteKey: string = '7K8DVxtNJGnMtUY1CQJT5jcs8sFGSZTDiG7kowvFpECh';
  public stakeAccounts$ = this._solanaUtilsService.walletExtended$.pipe(
    switchMap(async wallet =>{
      if(wallet){
        await this._solanaUtilsService.fetchAndUpdateStakeAccount(wallet.publicKey);
        let accounts = this._solanaUtilsService.getStakeAccountsExtended();
        if(this.privateValidatorPage){
          accounts = accounts.filter(acc => {
            if(acc.validatorVoteKey === this.AvaultoVoteKey){
              acc.validatorData.image = 'assets/images/icons/solana-logo.webp'
              return acc
            }
          })
        }
        return accounts
      }else{
        return null
      }
    }))
    
  public stakeAccountStatic = null;

  constructor(
    public loaderService: LoaderService,
    private _solanaUtilsService: SolanaUtilsService,

    private _popoverController: PopoverController
  ) { }

  public async ngOnChanges(){
    // automatic update when account has change
    if (this._solanaUtilsService.getCurrentWallet()) {
      this._solanaUtilsService.fetchAndUpdateStakeAccount(this._solanaUtilsService.getCurrentWallet().publicKey);
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
      componentProps:{account,wallet:this._solanaUtilsService.getCurrentWallet(), accounts},
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
