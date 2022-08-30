import { NgModule } from '@angular/core';
import { NftGalleryPageRoutingModule } from './nft-gallery-routing.module';

import { NftGalleryPage } from './nft-gallery.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { NftPagePage } from './nft-page/nft-page.page';
import { NftListingComponent } from './nft-page/nft-listing/nft-listing.component';
import { NftBurnComponent } from './nft-page/nft-burn/nft-burn.component';

@NgModule({
  imports: [
    SharedModule,
    NftGalleryPageRoutingModule
  ],
  declarations: [
    NftGalleryPage,
    NftPagePage, 
    NftListingComponent,
    NftBurnComponent
  ]
})
export class NftGalleryPageModule {}
