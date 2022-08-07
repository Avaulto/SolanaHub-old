import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WalletPageRoutingModule } from './wallet-routing.module';

import { WalletPage } from './wallet.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { StakeComponent } from './tx/stake/stake.component';

import { SendComponent } from './send/send.component';
import { HistoryComponent } from './history/history.component';
import { TxComponent } from './tx/tx.component';
import { SpotStakeComponent } from './tx/spot-stake/spot-stake.component';
import { DefiComponent } from './defi/defi.component';
import { AccountsComponent } from './tx/accounts/accounts.component';
import { ApyCalcComponent } from './tx/stake/apy-calc/apy-calc.component';

@NgModule({
  imports: [
    SharedModule,
    WalletPageRoutingModule
  ],
  declarations: [
    WalletPage,
    AccountsComponent,
    TxComponent,
    StakeComponent,
    SpotStakeComponent,
    SendComponent,
    HistoryComponent,
    DefiComponent,
    ApyCalcComponent
  ]
})
export class WalletPageModule { }
