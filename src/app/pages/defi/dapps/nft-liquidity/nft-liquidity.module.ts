import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NftLiquidityPageRoutingModule } from './nft-liquidity-routing.module';

import { NftLiquidityPage } from './nft-liquidity.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { FraktStatsComponent } from './frakt-stats/frakt-stats.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LendComponent } from './lend/lend.component';
import { BorrowComponent } from './borrow/borrow.component';
import { BoxContentComponent } from './lend/box-content/box-content.component';
import { CollateralNftComponent } from './collateral-nft/collateral-nft.component';
import { ActiveLoansComponent } from './dashboard/active-loans/active-loans.component';

import { CalcComponent } from './borrow/calc/calc.component';
import { ActiveDepositsComponent } from './dashboard/active-deposits/active-deposits.component';
import { HarvestComponent } from './dashboard/active-deposits/harvest/harvest.component';

@NgModule({
  imports: [
    SharedModule,
    NftLiquidityPageRoutingModule,

  ],
  declarations: [
    NftLiquidityPage,
    FraktStatsComponent,
    DashboardComponent,
    BoxContentComponent,
    LendComponent,
    BorrowComponent,
    CalcComponent,
    CollateralNftComponent,
    ActiveLoansComponent,
    ActiveDepositsComponent,
    HarvestComponent
  ]
})
export class NftLiquidityPageModule { }
