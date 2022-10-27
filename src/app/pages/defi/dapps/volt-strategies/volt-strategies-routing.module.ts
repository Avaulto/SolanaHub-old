import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VoltStrategiesPage } from './volt-strategies.page';

const routes: Routes = [
  {
    path: '',
    component: VoltStrategiesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VoltStrategiesPageRoutingModule {}
