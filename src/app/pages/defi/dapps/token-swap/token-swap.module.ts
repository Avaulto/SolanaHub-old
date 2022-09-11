import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TokenSwapPageRoutingModule } from './token-swap-routing.module';

import { TokenSwapPage } from './token-swap.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { JupInfoBoxComponent } from './jup-info-box/jup-info-box.component';
import { SwapInfoComponent } from './swap-info/swap-info.component';
import { SlippageComponent } from './slippage/slippage.component';

@NgModule({
  imports: [
    SharedModule,
    TokenSwapPageRoutingModule
  ],
  declarations: [TokenSwapPage, JupInfoBoxComponent,SwapInfoComponent,SlippageComponent]
})
export class TokenSwapPageModule {}
