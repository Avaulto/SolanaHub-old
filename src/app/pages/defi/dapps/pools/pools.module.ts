import { NgModule } from '@angular/core';
import { PoolsPageRoutingModule } from './pools-routing.module';

import { PoolsPage } from './pools.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { WhirlPoolComponent } from './whirl-pool/whirl-pool.component';

@NgModule({
  imports: [
    SharedModule,
    PoolsPageRoutingModule
  ],
  declarations: [PoolsPage,WhirlPoolComponent]
})
export class PoolsPageModule {}
