import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NftGalleryPageRoutingModule } from './nft-gallery-routing.module';

import { NftGalleryPage } from './nft-gallery.page';
import { CollectionComponent } from './collection/collection.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
SharedModule,
    NftGalleryPageRoutingModule
  ],
  declarations: [NftGalleryPage,CollectionComponent]
})
export class NftGalleryPageModule {}
