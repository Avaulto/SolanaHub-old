import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StakingGen2Page } from './staking-gen2.page';

const routes: Routes = [
  {
    path: '',
    component: StakingGen2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StakingGen2PageRoutingModule {}
