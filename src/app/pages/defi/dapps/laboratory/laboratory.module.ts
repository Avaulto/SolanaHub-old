import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LaboratoryPageRoutingModule } from './laboratory-routing.module';

import { LaboratoryPage } from './laboratory.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    LaboratoryPageRoutingModule
  ],
  declarations: [LaboratoryPage]
})
export class LaboratoryPageModule {}
