import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TheLaboratoryPageRoutingModule } from './the-laboratory-routing.module';

import { TheLaboratoryPage } from './the-laboratory.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    TheLaboratoryPageRoutingModule
  ],
  declarations: [TheLaboratoryPage]
})
export class TheLaboratoryPageModule { }
