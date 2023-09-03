import { Component, OnInit } from '@angular/core';
import { LoyaltyService } from '../../loyalty.service';
import { Observable, map } from 'rxjs';
import { LoyaltyLeaderBoard, AvalutoLoyaltyPoint } from 'src/app/models/avaulto-loyalty.model';
import { SolanaUtilsService } from 'src/app/services';

@Component({
  selector: 'app-leader-board',
  templateUrl: './leader-board.component.html',
  styleUrls: ['./leader-board.component.scss'],
})
export class LeaderBoardComponent  implements OnInit {

  constructor(
    private _solanaUtilsService:SolanaUtilsService,
    private _loyaltyService:LoyaltyService) { }
  public loyaltyLeaderBoard$: Observable<AvalutoLoyaltyPoint[]> = this._loyaltyService.getLoyaltyLeaderBoard().pipe(
    map(lb=> lb.sort((a, b) => b.loyaltyPoints - a.loyaltyPoints)))
  public walletExtended$: Observable<any> = this._solanaUtilsService.walletExtended$
  ngOnInit() {}

}
