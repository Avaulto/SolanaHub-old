import { NgModule } from '@angular/core';

import { PoolsPageRoutingModule } from './pools-routing.module';

import { PoolsPage } from './pools.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { OrcaInfoComponent } from './orca-info/orca-info.component';

@NgModule({
  imports: [
    SharedModule,
    PoolsPageRoutingModule
  ],
  declarations: [PoolsPage,OrcaInfoComponent]
})
export class PoolsPageModule { }
