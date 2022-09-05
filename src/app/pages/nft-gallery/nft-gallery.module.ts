import { NgModule } from '@angular/core';
import { NftGalleryPageRoutingModule } from './nft-gallery-routing.module';

import { NftGalleryPage } from './nft-gallery.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    NftGalleryPageRoutingModule
  ],
  declarations: [
    NftGalleryPage
  ]
})
export class NftGalleryPageModule {}
