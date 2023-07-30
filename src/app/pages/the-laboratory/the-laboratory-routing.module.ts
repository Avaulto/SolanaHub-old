import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TheLaboratoryPage } from './the-laboratory.page';

const routes: Routes = [
  {
    path: '',
    component: TheLaboratoryPage
  },

  {
    path: ':strategy',
    loadChildren: () => import('./basic-template/basic-template.module').then( m => m.BasicTemplatePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TheLaboratoryPageRoutingModule {}
