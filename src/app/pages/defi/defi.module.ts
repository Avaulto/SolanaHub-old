import { NgModule } from '@angular/core';
import { DefiPageRoutingModule } from './defi-routing.module';

import { DefiPage } from './defi.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { DefiTourComponent } from './defi-tour/defi-tour.component';

@NgModule({
  imports: [
SharedModule,
    DefiPageRoutingModule
  ],
  declarations: [DefiPage,DefiTourComponent]
})
export class DefiPageModule {}
