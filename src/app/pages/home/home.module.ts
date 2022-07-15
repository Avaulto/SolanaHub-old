import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { BalanceComponent } from './balance/balance.component';
import { RewardsComponent } from './rewards/rewards.component';
import { ChartComponent } from './chart/chart.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    SharedModule,
    HomePageRoutingModule,
    SharedModule,
    NgChartsModule
  ],
  declarations: [HomePage, BalanceComponent, RewardsComponent, ChartComponent]
})
export class HomePageModule { }
