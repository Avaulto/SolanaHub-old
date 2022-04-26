import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NftPagePage } from './nft-page.page';

const routes: Routes = [
  {
    path: '',
    component: NftPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NftPagePageRoutingModule {}
