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
    path: 'token-swap',
    loadChildren: () => import('./dapps/token-swap/token-swap.module').then( m => m.TokenSwapPageModule)
  },
  {
    path: 'nft-liquidity',
    loadChildren: () => import('./dapps/nft-liquidity/nft-liquidity.module').then( m => m.NftLiquidityPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DefiPageRoutingModule {}
