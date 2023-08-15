import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

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
    path: 'dashboard',
    loadChildren: () => import('./pages/wallet/wallet.module').then( m => m.WalletPageModule)
  },
  {
    path: 'nft-gallery',
    loadChildren: () => import('./pages/nft-gallery/nft-gallery.module').then( m => m.NftGalleryPageModule),
    // canActivate:[AuthGuard]
  },
  {
    path: 'defi',
    loadChildren: () => import('./pages/defi/defi.module').then( m => m.DefiPageModule)
  },
  {
    path: 'vote-what-next',
    loadChildren: () => import('./pages/vote-what-next/vote-what-next.module').then( m => m.VoteWhatNextPageModule)
  },
  {
    path: 'stake-with-us',
    loadChildren: () => import('./pages/stake-with-us/stake-with-us.module').then( m => m.StakeWithUsPageModule)
  },
  {
    path: 'the-laboratory',
    loadChildren: () => import('./pages/the-laboratory/the-laboratory.module').then( m => m.TheLaboratoryPageModule)
  },
  {
    path:"**",
    redirectTo:'home'
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
