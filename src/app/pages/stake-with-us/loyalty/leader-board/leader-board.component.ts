import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { LoyaltyService } from '../loyalty.service';
import { Observable, map, shareReplay, tap } from 'rxjs';
import { LoyaltyLeaderBoard, LoyaltyPoint, PrizePool } from 'src/app/models/loyalty.model';
import { SolanaUtilsService } from 'src/app/services';
import { WalletExtended } from 'src/app/models';

@Component({
  selector: 'app-leader-board',
  templateUrl: './leader-board.component.html',
  styleUrls: ['./leader-board.component.scss'],
})
export class LeaderBoardComponent  {
  constructor(
    private _solanaUtilsService: SolanaUtilsService,
  ) { }
  @Input() loyaltyLeagueStats: any
  public wallet$: Observable<WalletExtended> = this._solanaUtilsService.walletExtended$


}
