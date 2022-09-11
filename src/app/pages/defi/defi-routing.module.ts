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
    path: 'laboratory',
    loadChildren: () => import('./dapps/laboratory/laboratory.module').then( m => m.LaboratoryPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DefiPageRoutingModule {}
