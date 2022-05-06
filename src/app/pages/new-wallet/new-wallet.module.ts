import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewWalletPageRoutingModule } from './new-wallet-routing.module';

import { NewWalletPage } from './new-wallet.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
SharedModule,
    NewWalletPageRoutingModule
  ],
  declarations: [NewWalletPage]
})
export class NewWalletPageModule {}
