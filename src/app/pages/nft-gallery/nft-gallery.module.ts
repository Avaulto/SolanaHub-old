import { NgModule } from '@angular/core';
import { NftGalleryPageRoutingModule } from './nft-gallery-routing.module';

import { NftGalleryPage } from './nft-gallery.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { NftPreviewComponent } from './nft-preview/nft-preview.component';
import { NftPagePage } from './nft-page/nft-page.page';
import { NftListingComponent } from './nft-page/nft-listing/nft-listing.component';

@NgModule({
  imports: [
    SharedModule,
    NftGalleryPageRoutingModule
  ],
  declarations: [
    NftGalleryPage,
    NftPreviewComponent,
    NftPagePage, 
    NftListingComponent
  ]
})
export class NftGalleryPageModule {}
