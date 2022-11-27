import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StakeWithUsPage } from './stake-with-us.page';

const routes: Routes = [
  {
    path: '',
    component: StakeWithUsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StakeWithUsPageRoutingModule {}
