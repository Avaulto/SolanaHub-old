import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TokenSwapPage } from './token-swap.page';

const routes: Routes = [
  {
    path: '',
    component: TokenSwapPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TokenSwapPageRoutingModule {}
