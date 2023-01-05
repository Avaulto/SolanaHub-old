import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NftLiquidityPage } from './nft-liquidity.page';

const routes: Routes = [
  {
    path: '',
    component: NftLiquidityPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NftLiquidityPageRoutingModule {}
