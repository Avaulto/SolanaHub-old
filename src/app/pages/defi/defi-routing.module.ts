import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefiPage } from './defi.page';
import { LiquidStakingComponent } from './liquid-staking/liquid-staking.component';
import { PoolsComponent } from './pools/pools.component';
import { SelectDappComponent } from './select-dapp/select-dapp.component';

import { SwapComponent } from './swap/swap.component';

const routes: Routes = [
  {
    path: '',
    redirectTo:'/defi/select-dapp',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefiPage,
    children: [
      {
        path: 'select-dapp',
        component: SelectDappComponent
      },
      {
        path: 'swap',
        component: SwapComponent
      },
      {
        path: 'liquid-staking',
        component: LiquidStakingComponent
      },
      {
        path: 'pools',
        component: PoolsComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DefiPageRoutingModule { }
