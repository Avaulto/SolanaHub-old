import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { BalanceComponent } from './balance/balance.component';
import { RewardsComponent } from './rewards/rewards.component';
import { NftsComponent } from './nfts/nfts.component';
import { WalletsComponent } from './wallets/wallets.component';
import { ChartComponent } from './chart/chart.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
SharedModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage,BalanceComponent,RewardsComponent,NftsComponent,ChartComponent, WalletsComponent]
})
export class HomePageModule {}
