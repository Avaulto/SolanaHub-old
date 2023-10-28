import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LendBorrowPage } from './lend-borrow.page';

const routes: Routes = [
  {
    path: '',
    component: LendBorrowPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LendBorrowPageRoutingModule {}
