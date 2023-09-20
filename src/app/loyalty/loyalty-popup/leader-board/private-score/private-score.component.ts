import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { WalletExtended } from 'src/app/models';
import { LoyaltyPoint } from 'src/app/models/loyalty.model';

@Component({
  selector: 'app-private-score',
  templateUrl: './private-score.component.html',
  styleUrls: ['./private-score.component.scss'],
})
export class PrivateScoreComponent  implements OnInit {
  @Input() wallet:WalletExtended;
  @Input() leaderBoard: LoyaltyPoint[]
  @Input() totalRebates: number = 0;
  public myLoyaltyScore: LoyaltyPoint = null;
  constructor() { }

  ngOnInit() {
    if(this.wallet && this.leaderBoard){
      this.myLoyaltyScore = this.leaderBoard.filter(staker =>staker.walletOwner === this.wallet.publicKey.toBase58())[0] || null
    }
  }

}
