import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DefiPageRoutingModule } from './defi-routing.module';

import { DefiPage } from './defi.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DefiPageRoutingModule
  ],
  declarations: [DefiPage]
})
export class DefiPageModule {}
