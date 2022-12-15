import { NgModule } from '@angular/core';
import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';

import { SharedModule } from 'src/app/shared/shared.module';
import { DefiComponent } from './defi/defi.component';

@NgModule({
  imports: [
    SharedModule,
    HomePageRoutingModule,
  ],
  declarations: [HomePage,DefiComponent]
})
export class HomePageModule { }
