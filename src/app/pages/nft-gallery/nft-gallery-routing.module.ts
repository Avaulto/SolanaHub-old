import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NftGalleryPage } from './nft-gallery.page';

const routes: Routes = [
  {
    path: '',
    component: NftGalleryPage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NftGalleryPageRoutingModule {}
