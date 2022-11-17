import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VoltStrategiesPageRoutingModule } from './volt-strategies-routing.module';

import { VoltStrategiesPage } from './volt-strategies.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { FriktionInfoComponent } from './friktion-info/friktion-info.component';
import { VoltPopupComponent } from './volt/volt-popup/volt-popup.component';
import { VoltComponent } from './volt/volt.component';

@NgModule({
  imports: [
    SharedModule,
    VoltStrategiesPageRoutingModule
  ],
  declarations: [VoltStrategiesPage,VoltComponent,VoltPopupComponent, FriktionInfoComponent]
})
export class VoltStrategiesPageModule { }
