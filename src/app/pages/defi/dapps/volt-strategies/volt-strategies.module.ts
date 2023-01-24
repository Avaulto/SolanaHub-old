import { NgModule } from '@angular/core';
import { VoltStrategiesPageRoutingModule } from './volt-strategies-routing.module';

import { VoltStrategiesPage } from './volt-strategies.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { FriktionInfoComponent } from './friktion-info/friktion-info.component';

import { VoltComponent } from './volt/volt.component';
import { VoltBackComponent } from './volt/volt-back/volt-back.component';

@NgModule({
  imports: [
    SharedModule,
    VoltStrategiesPageRoutingModule
  ],
  declarations: [VoltStrategiesPage,VoltComponent,VoltBackComponent, FriktionInfoComponent]
})
export class VoltStrategiesPageModule { }
