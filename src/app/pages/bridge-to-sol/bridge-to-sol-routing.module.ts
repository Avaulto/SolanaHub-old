import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BridgeToSolPage } from './bridge-to-sol.page';

const routes: Routes = [
  {
    path: '',
    component: BridgeToSolPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BridgeToSolPageRoutingModule {}
