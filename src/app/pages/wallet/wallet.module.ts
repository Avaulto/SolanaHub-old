import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WalletPageRoutingModule } from './wallet-routing.module';

import { WalletPage } from './wallet.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { CollectionComponent } from './collection/collection.component';

@NgModule({
  imports: [
    SharedModule,
    SharedModule,
    WalletPageRoutingModule
  ],
  declarations: [WalletPage,CollectionComponent]
})
export class WalletPageModule {}
