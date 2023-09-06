import { Component, Input, OnInit } from '@angular/core';
import { LoyaltyService } from '../../loyalty.service';
import { Observable, map, shareReplay, tap } from 'rxjs';
import { LoyaltyLeaderBoard, LoyaltyPoint } from 'src/app/models/loyalty.model';
import { SolanaUtilsService } from 'src/app/services';
import { WalletExtended } from 'src/app/models';

@Component({
  selector: 'app-leader-board',
  templateUrl: './leader-board.component.html',
  styleUrls: ['./leader-board.component.scss'],
})
export class LeaderBoardComponent implements OnInit {

  constructor(
    private _solanaUtilsService: SolanaUtilsService,
    private _loyaltyService: LoyaltyService
  ) { }
  @Input() prizePool: number
  public loyaltyLeaderBoard$: Observable<LoyaltyPoint[]> = this._loyaltyService.getLoyaltyLeaderBoard().pipe(
    shareReplay(),
    tap(lb => this.totalLoyaltyPoints = lb.reduce(
      (previousValue, currentValue: LoyaltyPoint) => previousValue + currentValue.loyaltyPoints,
      0
    ))
  )
  public totalLoyaltyPoints = 0
  public wallet: WalletExtended = this._solanaUtilsService.getCurrentWallet()
  ngOnInit() { }

}
