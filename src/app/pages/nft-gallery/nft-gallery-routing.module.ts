import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NftGalleryPage } from './nft-gallery.page';
import { NftPagePage } from './nft-page/nft-page.page';

const routes: Routes = [
  {
    path: '',
    component: NftGalleryPage,
  },
  {
    path: ':mintAddress',
    component: NftPagePage
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NftGalleryPageRoutingModule { }
