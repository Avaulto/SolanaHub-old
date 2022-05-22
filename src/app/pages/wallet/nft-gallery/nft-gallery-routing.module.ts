import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NftGalleryPage } from './nft-gallery.page';

const routes: Routes = [
  {
    path: '',
    component: NftGalleryPage
  },
  {
    path: 'nft-page',
    loadChildren: () => import('./nft-page/nft-page.module').then( m => m.NftPagePageModule),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NftGalleryPageRoutingModule {}
