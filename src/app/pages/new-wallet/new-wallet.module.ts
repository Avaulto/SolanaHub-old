import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewWalletPageRoutingModule } from './new-wallet-routing.module';

import { NewWalletPage } from './new-wallet.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewWalletPageRoutingModule
  ],
  declarations: [NewWalletPage]
})
export class NewWalletPageModule {}
