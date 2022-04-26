import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WalletPage } from './wallet.page';

const routes: Routes = [
  {
    path: '',
    component: WalletPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WalletPageRoutingModule {}
