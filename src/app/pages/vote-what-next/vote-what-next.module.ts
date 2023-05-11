import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VoteWhatNextPageRoutingModule } from './vote-what-next-routing.module';

import { VoteWhatNextPage } from './vote-what-next.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProposalsComponent } from './proposals/proposals.component';
import { NewProposalComponent } from './new-proposal/new-proposal.component';
import { StatsComponent } from './stats/stats.component';
import { ItemComponent } from './proposals/item/item.component';

@NgModule({
  imports: [
SharedModule,
    VoteWhatNextPageRoutingModule
  ],
  declarations: [VoteWhatNextPage,StatsComponent, ProposalsComponent,ItemComponent, NewProposalComponent]
})
export class VoteWhatNextPageModule {}
