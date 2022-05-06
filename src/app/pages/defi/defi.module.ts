import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

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
