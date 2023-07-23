import { NgModule } from '@angular/core';
import { MarinadePlusPageRoutingModule } from './marinade-plus-routing.module';

import { MarinadePlusPage } from './marinade-plus.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    MarinadePlusPageRoutingModule
  ],
  declarations: [MarinadePlusPage]
})
export class MarinadePlusPageModule {}
