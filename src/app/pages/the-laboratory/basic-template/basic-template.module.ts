import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BasicTemplatePageRoutingModule } from './basic-template-routing.module';

import { BasicTemplatePage } from './basic-template.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ClaimComponent } from './claim/claim.component';
import { WithdrawComponent } from './withdraw/withdraw.component';
import { DepositComponent } from './deposit/deposit.component';
import { StrategyStatsComponent } from './strategy-stats/strategy-stats.component';
import { TxProcessStatusComponent } from './tx-process-status/tx-process-status.component';

@NgModule({
  imports: [
    SharedModule,
    BasicTemplatePageRoutingModule
  ],
  declarations: [BasicTemplatePage,TxProcessStatusComponent,StrategyStatsComponent, DepositComponent, WithdrawComponent, ClaimComponent]
})
export class BasicTemplatePageModule { }
