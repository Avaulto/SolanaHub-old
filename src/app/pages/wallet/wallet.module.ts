import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WalletPageRoutingModule } from './wallet-routing.module';

import { WalletPage } from './wallet.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { CollectionComponent } from './collection/collection.component';
import { StakeComponent } from './stake/stake.component';
import { RewardComponent } from './reward/reward.component';
import { SendComponent } from './send/send.component';
import { HistoryComponent } from './history/history.component';

@NgModule({
  imports: [
    SharedModule,
    SharedModule,
    WalletPageRoutingModule
  ],
  declarations: [WalletPage,CollectionComponent, StakeComponent,RewardComponent,SendComponent,HistoryComponent]
})
export class WalletPageModule {}
