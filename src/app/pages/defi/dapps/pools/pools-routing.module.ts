import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PoolsPage } from './pools.page';

const routes: Routes = [
  {
    path: '',
    component: PoolsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PoolsPageRoutingModule {}
