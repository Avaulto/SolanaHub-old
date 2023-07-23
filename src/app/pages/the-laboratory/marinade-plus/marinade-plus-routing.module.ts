import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MarinadePlusPage } from './marinade-plus.page';

const routes: Routes = [
  {
    path: '',
    component: MarinadePlusPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarinadePlusPageRoutingModule {}
