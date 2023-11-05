import { NgModule } from '@angular/core';
import { PrizePoolComponent } from './prize-pool/prize-pool.component';
import { LeaderBoardComponent } from './leader-board/leader-board.component';
import { ItemComponent } from './leader-board/item/item.component';
import { SharedModule } from '../../../shared/shared.module';
import { ScoreComponent } from './score/score.component';



@NgModule({
  declarations: [
    PrizePoolComponent,
    LeaderBoardComponent,
    ItemComponent,
    ScoreComponent
  ],
  imports: [
    SharedModule
  ],
  exports:[
    PrizePoolComponent,
    LeaderBoardComponent,
    ScoreComponent
  ]
})
export class LoyaltyModule { }
