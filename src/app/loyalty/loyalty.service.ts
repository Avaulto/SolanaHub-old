import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { ApiService } from '../services/api.service';
import { UtilsService } from '../services/utils.service';
import { Observable, map, shareReplay } from 'rxjs';
import { LoyaltyLeaderBoard, LoyaltyPoint, LoyaltyScore, NextAirdrop, PrizePool } from '../models/loyalty.model'



@Injectable({
  providedIn: 'root'
})
export class LoyaltyService {
  protected api = this._utilsService.serverlessAPI + '/api/loyalty-points'
  constructor(
    private _utilsService: UtilsService,
    private _apiService: ApiService
  ) { }

  // const { remaining_seconds, elapsed_seconds, duration_seconds } = data
  // const days = Math.floor(remaining_seconds / 86400);
  // const hours = Math.floor(remaining_seconds / 3600) - (days * 24);
  // data.ETA = `ETA ${days} Days and ${hours} Hours`
  // data.timepassInPercentgae = elapsed_seconds / duration_seconds
  public getNextAirdrop(): Observable<NextAirdrop> {
    return this._apiService.get(`${this.api}/get-next-airdrop`).pipe(
      shareReplay(),
      this._utilsService.isNotNull,
      map((nextAirdrop: NextAirdrop) => {
        return nextAirdrop
      })
    )
  }
  public getLoyaltyScore(): Observable<LoyaltyScore> {
    return this._apiService.get(`${this.api}/score`).pipe(
      shareReplay(),
      this._utilsService.isNotNull,
      map((loyaltyScore: LoyaltyScore) => {
        return loyaltyScore
      })
    )
  }
  public getLoyaltyLeaderBoard(): Observable<LoyaltyLeaderBoard> {
    return this._apiService.get(`${this.api}/leader-board`).pipe(
      this._utilsService.isNotNull,
      map((loyaltyLeaderBoard: LoyaltyLeaderBoard) => {
        return loyaltyLeaderBoard
      }),
      shareReplay()
    )
  }
  public getPrizePool(): Observable<PrizePool> {
    return this._apiService.get(`${this.api}/prize-pool`).pipe(
      shareReplay(),
      this._utilsService.isNotNull,
      map((prizePool: PrizePool) => {
        return prizePool
      })
    )
  }
}
