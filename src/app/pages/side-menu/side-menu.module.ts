import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SideMenuPageRoutingModule } from './side-menu-routing.module';

import { SideMenuPage } from './side-menu.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { NftsComponent } from '../home/nfts/nfts.component';

@NgModule({
  imports: [
    SharedModule,
    SideMenuPageRoutingModule
  ],
  declarations: [SideMenuPage,NftsComponent]
})
export class SideMenuPageModule {}
