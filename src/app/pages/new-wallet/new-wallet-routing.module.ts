import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewWalletPage } from './new-wallet.page';

const routes: Routes = [
  {
    path: '',
    component: NewWalletPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewWalletPageRoutingModule {}
