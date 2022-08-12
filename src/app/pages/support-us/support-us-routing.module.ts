import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SupportUsPage } from './support-us.page';

const routes: Routes = [
  {
    path: '',
    component: SupportUsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupportUsPageRoutingModule {}
