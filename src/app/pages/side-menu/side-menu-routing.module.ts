import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/services';

import { SideMenuPage } from './side-menu.page';


const routes: Routes = [
  {
    path: "",
    redirectTo: "/side-menu/home",
    pathMatch: "full",
  },
  {
    path: "",
    component: SideMenuPage,

    children: [
      {
        path: "home",
        loadChildren: () =>
          import("../home/home.module").then((m) => m.HomePageModule),
      },
      {
        path: "nft-gallery",
        loadChildren: () =>
          import("../nft-gallery/nft-gallery.module").then((m) => m.NftGalleryPageModule),
      },
      
        {
          path: "nft-gallery/:id",
          loadChildren: () =>
            import("../nft-gallery/nft-page/nft-page.module").then((m) => m.NftPagePageModule),
        },
      
      {
        path: "wallet/:id",
        loadChildren: () =>
          import("../wallet/wallet.module").then((m) => m.WalletPageModule),
      },
      {
        path: "defi",
        loadChildren: () =>
          import("../defi/defi.module").then((m) => m.DefiPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SideMenuPageRoutingModule {}
