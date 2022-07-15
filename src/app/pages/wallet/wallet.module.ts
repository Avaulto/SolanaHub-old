import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WalletPageRoutingModule } from './wallet-routing.module';

import { WalletPage } from './wallet.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { CollectionComponent } from './collection/collection.component';
import { StakeComponent } from './tx/stake/stake.component';

import { RewardComponent } from './tx/reward/reward.component';
import { SendComponent } from './tx/send/send.component';
import { HistoryComponent } from './tx/history/history.component';
import { TxComponent } from './tx/tx.component';
import { SpotStakeComponent } from './tx/spot-stake/spot-stake.component';
import { DefiComponent } from './defi/defi.component';

@NgModule({
  imports: [
    SharedModule,
    SharedModule,
    WalletPageRoutingModule
  ],
  declarations: [WalletPage,
    CollectionComponent,
    TxComponent,
     StakeComponent,
     SpotStakeComponent,
     RewardComponent,
     SendComponent,
     HistoryComponent,
     DefiComponent
    ]
})
export class WalletPageModule {}
