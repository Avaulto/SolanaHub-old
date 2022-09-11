import { NgModule } from '@angular/core';
import { DefiPageRoutingModule } from './defi-routing.module';

import { DefiPage } from './defi.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
SharedModule,
    DefiPageRoutingModule
  ],
  declarations: [DefiPage]
})
export class DefiPageModule {}
