import { Component, OnInit } from '@angular/core';
import { LoyaltyService } from '../../loyalty.service';
import { Observable } from 'rxjs';
import { LoyaltyLeaderBoard } from 'src/app/models/avaulto-loyalty.model';

@Component({
  selector: 'app-leader-board',
  templateUrl: './leader-board.component.html',
  styleUrls: ['./leader-board.component.scss'],
})
export class LeaderBoardComponent  implements OnInit {

  constructor(private _loyaltyService:LoyaltyService) { }
  public loyaltyLeaderBoard$: Observable<LoyaltyLeaderBoard> = this._loyaltyService.getLoyaltyLeaderBoard()
  ngOnInit() {}

}
