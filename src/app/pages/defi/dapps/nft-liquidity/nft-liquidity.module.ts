import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NftLiquidityPageRoutingModule } from './nft-liquidity-routing.module';

import { NftLiquidityPage } from './nft-liquidity.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { FraktStatsComponent } from './frakt-stats/frakt-stats.component';

@NgModule({
  imports: [
SharedModule,
    NftLiquidityPageRoutingModule
  ],
  declarations: [NftLiquidityPage,FraktStatsComponent]
})
export class NftLiquidityPageModule {}
