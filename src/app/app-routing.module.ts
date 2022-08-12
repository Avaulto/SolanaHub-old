import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: "home",
    loadChildren: () =>
      import("./pages/home/home.module").then((m) => m.HomePageModule),
  },
  {
    path: 'wallet',
    loadChildren: () => import('./pages/wallet/wallet.module').then( m => m.WalletPageModule)
  },
  {
    path: 'nft-gallery',
    loadChildren: () => import('./pages/nft-gallery/nft-gallery.module').then( m => m.NftGalleryPageModule),
    // canActivate:[AuthGuard]
  },
  {
    path: 'support-us',
    loadChildren: () => import('./pages/support-us/support-us.module').then( m => m.SupportUsPageModule)
  },
  {
    path: 'liquid-stake',
    loadChildren: () => import('./pages/liquid-stake/liquid-stake.module').then( m => m.LiquidStakePageModule)
  },
  {
    path: 'lending',
    loadChildren: () => import('./pages/lending/lending.module').then( m => m.LendingPageModule)
  },
  {
    path: 'token-swap',
    loadChildren: () => import('./pages/token-swap/token-swap.module').then( m => m.TokenSwapPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
