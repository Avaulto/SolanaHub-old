import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefiPage } from './defi.page';

const routes: Routes = [
  {
    path: '',
    component: DefiPage
  },
  {
    path: 'liquid-stake',
    loadChildren: () => import('./dapps/liquid-stake/liquid-stake.module').then( m => m.LiquidStakePageModule)
  },
  {
    path: 'lending',
    loadChildren: () => import('./dapps/lending/lending.module').then( m => m.LendingPageModule)
  },
  {
    path: 'token-swap',
    loadChildren: () => import('./dapps/token-swap/token-swap.module').then( m => m.TokenSwapPageModule)
  },
  {
    path: 'volt-strategies',
    loadChildren: () => import('./dapps/volt-strategies/volt-strategies.module').then( m => m.VoltStrategiesPageModule)
  },
  {
    path: 'pools',
    loadChildren: () => import('./dapps/pools/pools.module').then( m => m.PoolsPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DefiPageRoutingModule {}
