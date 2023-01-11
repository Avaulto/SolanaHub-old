import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LiquidStakePageRoutingModule } from './liquid-stake-routing.module';

import { LiquidStakePage } from './liquid-stake.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { LiquidStakingStatsComponent } from './liquid-staking-stats/liquid-staking-stats.component';
import { StakeSolBoxComponent } from './stake-sol-box/stake-sol-box.component';
import { StakeAccountBoxComponent } from './stake-account-box/stake-account-box.component';
import { SwapProviderBtnComponent } from './swap-provider-btn/swap-provider-btn.component';

@NgModule({
  imports: [
    SharedModule,
    LiquidStakePageRoutingModule
  ],
  declarations: [
    LiquidStakePage,
    LiquidStakingStatsComponent,
    StakeSolBoxComponent,
    StakeAccountBoxComponent,
    SwapProviderBtnComponent
  ]
})
export class LiquidStakePageModule { }
