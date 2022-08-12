import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SupportUsPageRoutingModule } from './support-us-routing.module';

import { SupportUsPage } from './support-us.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SupportUsPageRoutingModule
  ],
  declarations: [SupportUsPage]
})
export class SupportUsPageModule {}
