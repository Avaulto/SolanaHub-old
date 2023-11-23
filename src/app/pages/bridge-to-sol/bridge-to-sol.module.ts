import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BridgeToSolPageRoutingModule } from './bridge-to-sol-routing.module';

import { BridgeToSolPage } from './bridge-to-sol.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BridgeToSolPageRoutingModule
  ],
  declarations: [BridgeToSolPage]
})
export class BridgeToSolPageModule {}
