import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IonCheckbox, PopoverController } from '@ionic/angular';
import { StakeAccountExtended } from 'src/app/models';
import { SolanaUtilsService, UtilsService } from 'src/app/services';
import { ActionsComponent } from '../actions/actions.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  @Input() account: StakeAccountExtended;
  @Input() allAccounts: StakeAccountExtended[]
  @Input() mergeCondition: boolean = false;
  @Output() onClickAccount: EventEmitter<any> = new EventEmitter();
  @Input() isChecked: boolean = false;
  @Input() actionType: string = '';
  public solPrice = this._solanaUtilsService.lastSolPrice();
  constructor(
    private _solanaUtilsService:SolanaUtilsService,
    private _utilsService:UtilsService,
    private _popoverController: PopoverController
    ) { }

  ngOnInit() {
  
    
  }
  public convertNumber(num){
    return this._utilsService.formatBigNumbers(num)
  }
  appendAccountData(){
    this.isChecked = !this.isChecked;
    this.onClickAccount.emit({ account:this.account, accCheckbox:this.isChecked})
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
  async openStakeAccountActions(e: Event, account: StakeAccountExtended) {
    const popover = await this._popoverController.create({
      component: ActionsComponent,
      componentProps:{account,wallet:this._solanaUtilsService.getCurrentWallet(), accounts: this.allAccounts},
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
