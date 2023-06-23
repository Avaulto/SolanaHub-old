import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VaultLiquidityPage } from './vault-liquidity.page';

const routes: Routes = [
  {
    path: '',
    component: VaultLiquidityPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VaultLiquidityPageRoutingModule {}
