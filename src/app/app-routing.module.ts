import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'side-menu',
    pathMatch: 'full'
  },
  // {
  //   path: 'login',
  //   loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  // },
  {
    path: 'side-menu',
    // canActivate:[AuthGuard],
    loadChildren: () => import('./pages/side-menu/side-menu.module').then( m => m.SideMenuPageModule)
  },
  {
    path: 'wallet',
    loadChildren: () => import('./pages/wallet/wallet.module').then( m => m.WalletPageModule)
  },
  {
    path: 'defi',
    loadChildren: () => import('./pages/defi/defi.module').then( m => m.DefiPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'new-wallet',
    loadChildren: () => import('./pages/new-wallet/new-wallet.module').then( m => m.NewWalletPageModule)
  },
  {
    path: 'nft-gallery',
    loadChildren: () => import('./pages/nft-gallery/nft-gallery.module').then( m => m.NftGalleryPageModule),
    // canActivate:[AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
