import { NgModule } from '@angular/core';
import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { ChartComponent } from './chart/chart.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgChartsModule } from 'ng2-charts';
import { DefiComponent } from '../wallet/defi/defi.component';

@NgModule({
  imports: [
    SharedModule,
    HomePageRoutingModule,
    SharedModule,
    NgChartsModule
  ],
  declarations: [HomePage,ChartComponent,DefiComponent]
})
export class HomePageModule { }
