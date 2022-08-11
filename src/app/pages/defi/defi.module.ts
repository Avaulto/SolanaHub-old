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
import { StakeAccountBoxComponent } from './liquid-staking/stake-account-box/stake-account-box.component';
import { StakeSolBoxComponent } from './liquid-staking/stake-sol-box/stake-sol-box.component';
import { SwapInfoComponent } from './swap/swap-info/swap-info.component';
import { SlippageComponent } from './swap/slippage/slippage.component';
import { JupInfoBoxComponent } from './swap/jup-info-box/jup-info-box.component';

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
    MarinadeInfoBoxComponent,
    StakeSolBoxComponent,
    StakeAccountBoxComponent,
    // jup
    SwapInfoComponent,
    SlippageComponent,
    JupInfoBoxComponent
  ]
})
export class DefiPageModule {}
