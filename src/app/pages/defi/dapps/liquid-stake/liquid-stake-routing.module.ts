import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LiquidStakePage } from './liquid-stake.page';

const routes: Routes = [
  {
    path: '',
    component: LiquidStakePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LiquidStakePageRoutingModule {}
