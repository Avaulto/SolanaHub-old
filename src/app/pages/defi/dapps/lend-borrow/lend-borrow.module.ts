import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LendBorrowPageRoutingModule } from './lend-borrow-routing.module';

import { LendBorrowPage } from './lend-borrow.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { SupplyListComponent } from './supply-list/supply-list.component';
import { PositionsComponent } from './positions/positions.component';
import { ActionsPopupComponent } from './actions-popup/actions-popup.component';

@NgModule({
  imports: [
SharedModule,
    LendBorrowPageRoutingModule
  ],
  declarations: [LendBorrowPage, SupplyListComponent, PositionsComponent,ActionsPopupComponent]
})
export class LendBorrowPageModule {}
