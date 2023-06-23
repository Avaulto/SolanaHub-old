import { NgModule } from '@angular/core';
import { VaultLiquidityPageRoutingModule } from './vault-liquidity-routing.module';

import { VaultLiquidityPage } from './vault-liquidity.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { MeteoraStatsComponent } from './meteora-stats/meteora-stats.component';

@NgModule({
  imports: [
    SharedModule,
    VaultLiquidityPageRoutingModule,
  ],
  declarations: [VaultLiquidityPage, MeteoraStatsComponent]
})
export class VaultLiquidityPageModule { }
