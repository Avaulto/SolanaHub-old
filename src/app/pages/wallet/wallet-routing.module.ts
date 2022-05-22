import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WalletPage } from './wallet.page';

const routes: Routes = [
  {
    path: '',
    component: WalletPage,     
  },
  {
    path: "nft-gallery",
    loadChildren: () =>
      import("../wallet/nft-gallery/nft-gallery.module").then((m) => m.NftGalleryPageModule),
  },

  {
    path: "nft-gallery/:id",
    loadChildren: () =>
      import("../wallet/nft-gallery/nft-page/nft-page.module").then((m) => m.NftPagePageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WalletPageRoutingModule {}
