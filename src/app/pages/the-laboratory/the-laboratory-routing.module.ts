import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TheLaboratoryPage } from './the-laboratory.page';

const routes: Routes = [
  {
    path: '',
    component: TheLaboratoryPage
  },
  {
    path: 'marinade-plus',
    loadChildren: () => import('./marinade-plus/marinade-plus.module').then( m => m.MarinadePlusPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TheLaboratoryPageRoutingModule {}
