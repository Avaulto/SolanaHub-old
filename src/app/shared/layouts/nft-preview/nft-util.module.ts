import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NftPreviewComponent } from './nft-preview.component';
import { ImagePlaceholderComponent, LabelLayoutComponent} from '../../components';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { NftBurnComponent } from './nft-burn/nft-burn.component';
import { NftListingComponent } from './nft-listing/nft-listing.component';
import { NftSendComponent } from './nft-send/nft-send.component';



@NgModule({
  declarations: [
    NftPreviewComponent,
    NftBurnComponent,
    NftListingComponent,
    NftSendComponent,
    LabelLayoutComponent
  ],
  imports: [
    ImagePlaceholderComponent,
    ReactiveFormsModule,
    IonicModule,
    CommonModule,
  ],
  exports: [NftPreviewComponent]
})
export class NftUtilModule { }
