import { NgModule } from '@angular/core';
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
