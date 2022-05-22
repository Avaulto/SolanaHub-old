import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NftPagePageRoutingModule } from './nft-page-routing.module';

import { NftPagePage } from './nft-page.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
SharedModule,
    NftPagePageRoutingModule
  ],
  declarations: [NftPagePage]
})
export class NftPagePageModule {}
