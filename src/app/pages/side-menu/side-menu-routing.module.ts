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
          import("../home/home-routing.module").then((m) => m.HomePageRoutingModule),
      },
      {
        path: "nft-gallery",
        loadChildren: () =>
          import("../nft-gallery/nft-gallery-routing.module").then((m) => m.NftGalleryPageRoutingModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SideMenuPageRoutingModule {}
