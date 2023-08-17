import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { ActionsComponent } from './actions/actions.component';
import { AccountsComponent } from './accounts.component';
import { AccountsPopupComponent } from './accounts-popup/accounts-popup.component';
import { AccountComponent } from './account/account.component';
import { IonicModule } from '@ionic/angular';
import { WalletModule } from '../../wallet.module';
import { TooltipModule } from '../tooltip/tooltip.module';
import { SharedModule } from '../../shared.module';


@NgModule({
  declarations: [
    ActionsComponent,
    AccountsComponent,
    AccountsPopupComponent,
    AccountComponent,
  ],
  imports: [
    SharedModule,
    WalletModule,
  ],
  exports: [
    ActionsComponent,
    AccountsComponent,
    AccountsPopupComponent,
    AccountComponent,
  ]
})
export class AccountsModule {
}
