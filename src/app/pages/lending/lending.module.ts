import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LendingPageRoutingModule } from './lending-routing.module';

import { LendingPage } from './lending.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LendingPageRoutingModule
  ],
  declarations: [LendingPage]
})
export class LendingPageModule {}
