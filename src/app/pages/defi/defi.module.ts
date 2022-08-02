import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DefiPageRoutingModule } from './defi-routing.module';

import { DefiPage } from './defi.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { SwapComponent } from './swap/swap.component';
import { SelectDappComponent } from './select-dapp/select-dapp.component';
import { LiquidStakingComponent } from './liquid-staking/liquid-staking.component';
import { MarinadeInfoBoxComponent } from './liquid-staking/marinade-info-box/marinade-info-box.component';

@NgModule({
  imports: [
    SharedModule,
    DefiPageRoutingModule
  ],
  declarations: [
    DefiPage,
    SwapComponent,
    SelectDappComponent,
    LiquidStakingComponent,
    MarinadeInfoBoxComponent
  ]
})
export class DefiPageModule {}
