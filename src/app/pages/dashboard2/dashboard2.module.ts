import { NgModule } from '@angular/core';

import { Dashboard2PageRoutingModule } from './dashboard2-routing.module';

import { Dashboard2Page } from './dashboard2.page';
import { QRCodeModule } from 'angularx-qrcode';
import { SharedModule } from 'src/app/shared/shared.module';
import { AssetsComponent } from './assets/assets.component';
import { TotalBalanceComponent } from './total-balance/total-balance.component';
import { CoinsComponent } from './assets/coins/coins.component';
import { NFTsComponent } from './assets/nfts/nfts.component';

import { DefiComponent } from './defi/defi.component';
import { AccountsModule } from 'src/app/shared/layouts/accounts/accounts.module';
import { StakeAccountsComponent } from './stake-accounts/stake-accounts.component';
import { SendComponent } from './assets/send/send.component';


@NgModule({
  imports: [
    SharedModule,
    QRCodeModule,
    AccountsModule,
    Dashboard2PageRoutingModule
  ],
  declarations: [
    Dashboard2Page,
    AssetsComponent,
    TotalBalanceComponent,
    StakeAccountsComponent,
    CoinsComponent,
    NFTsComponent,
    DefiComponent,
    SendComponent
  ]
})
export class Dashboard2PageModule { }
