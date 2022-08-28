import { NgModule } from '@angular/core';
import { NftGalleryPageRoutingModule } from './nft-gallery-routing.module';

import { NftGalleryPage } from './nft-gallery.page';
import { CollectionComponent } from './collection/collection.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NftPreviewComponent } from './nft-preview/nft-preview.component';
import { NftPagePage } from './nft-page/nft-page.page';

@NgModule({
  imports: [
    SharedModule,
    NftGalleryPageRoutingModule
  ],
  declarations: [
    NftGalleryPage,
    CollectionComponent,
    NftPreviewComponent,
    NftPagePage
  ]
})
export class NftGalleryPageModule {}
