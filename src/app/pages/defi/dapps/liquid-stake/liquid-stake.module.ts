import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LiquidStakePageRoutingModule } from './liquid-stake-routing.module';

import { LiquidStakePage } from './liquid-stake.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { MarinadeInfoBoxComponent } from './marinade-info-box/marinade-info-box.component';
import { StakeSolBoxComponent } from './stake-sol-box/stake-sol-box.component';
import { StakeAccountBoxComponent } from './stake-account-box/stake-account-box.component';

@NgModule({
  imports: [
    SharedModule,
    LiquidStakePageRoutingModule
  ],
  declarations: [
    LiquidStakePage,
     MarinadeInfoBoxComponent,
    StakeSolBoxComponent,
    StakeAccountBoxComponent
  ]
})
export class LiquidStakePageModule { }
