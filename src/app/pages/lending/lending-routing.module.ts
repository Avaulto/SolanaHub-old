import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LendingPage } from './lending.page';

const routes: Routes = [
  {
    path: '',
    component: LendingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LendingPageRoutingModule {}
