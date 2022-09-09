import { NgModule } from '@angular/core';
import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';

import { SharedModule } from 'src/app/shared/shared.module';
import { NgChartsModule } from 'ng2-charts';
import { DefiComponent } from './defi/defi.component';

@NgModule({
  imports: [
    SharedModule,
    HomePageRoutingModule,
    NgChartsModule
  ],
  declarations: [HomePage,DefiComponent]
})
export class HomePageModule { }
