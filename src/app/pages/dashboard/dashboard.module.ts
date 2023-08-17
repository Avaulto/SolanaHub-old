import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { WalletPageRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './dashboard.page';
import { SharedModule } from 'src/app/shared/shared.module';

import { SendComponent } from './send/send.component';
import { TxComponent } from './tx/tx.component';
import { AccountsComponent } from '../../shared/layouts/accounts/accounts.component';
import { QRCodeModule } from 'angularx-qrcode';
import { ActionsComponent } from '../../shared/layouts/accounts/actions/actions.component';
import { AccountsPopupComponent } from '../../shared/layouts/accounts/accounts-popup/accounts-popup.component';
import { AccountComponent } from '../../shared/layouts/accounts/account/account.component';
import { ConvertBalancePopupComponent } from './convert-balance-popup/convert-balance-popup.component';
import { AccountsModule } from 'src/app/shared/layouts/accounts/accounts.module';


@NgModule({
  schemas:[NO_ERRORS_SCHEMA],
  imports: [
    SharedModule,
    WalletPageRoutingModule,
    QRCodeModule,
    AccountsModule,
  ],
  declarations: [
    DashboardPage,
    TxComponent,
    SendComponent,
    ConvertBalancePopupComponent
  ]
})
export class DashboardPageModule { }
