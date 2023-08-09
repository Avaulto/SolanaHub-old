import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BasicTemplatePage } from './basic-template.page';

const routes: Routes = [
  {
    path: '',
    component: BasicTemplatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BasicTemplatePageRoutingModule {}
