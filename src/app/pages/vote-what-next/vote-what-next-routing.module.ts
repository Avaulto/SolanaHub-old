import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VoteWhatNextPage } from './vote-what-next.page';

const routes: Routes = [
  {
    path: '',
    component: VoteWhatNextPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VoteWhatNextPageRoutingModule {}
