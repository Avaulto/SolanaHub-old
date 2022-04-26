import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NftGalleryPageRoutingModule } from './nft-gallery-routing.module';

import { NftGalleryPage } from './nft-gallery.page';
import { CollectionComponent } from './collection/collection.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NftGalleryPageRoutingModule
  ],
  declarations: [NftGalleryPage,CollectionComponent]
})
export class NftGalleryPageModule {}
