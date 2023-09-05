import { NgModule } from '@angular/core';
import { LoyaltyBtnComponent } from './loyalty-btn/loyalty-btn.component';
import { LoyaltyPopupComponent } from './loyalty-popup/loyalty-popup.component';
import { IonicModule } from '@ionic/angular';
import { PrizePoolComponent } from './loyalty-popup/prize-pool/prize-pool.component';
import { LeaderBoardComponent } from './loyalty-popup/leader-board/leader-board.component';
import { ItemComponent } from './loyalty-popup/leader-board/item/item.component';
import { PrivateScoreComponent } from './loyalty-popup/leader-board/private-score/private-score.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    LoyaltyBtnComponent,
    LoyaltyPopupComponent,
    PrizePoolComponent,
    LeaderBoardComponent,
    ItemComponent,
    PrivateScoreComponent,
  ],
  imports: [
    SharedModule
  ],
  exports:[
    LoyaltyBtnComponent,
  ]
})
export class LoyaltyModule { }
