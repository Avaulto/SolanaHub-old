import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { ApiService } from '../../../services/api.service';
import { UtilsService } from '../../../services/utils.service';
import { Observable, catchError, map, shareReplay, throwError } from 'rxjs';
import { LoyaltyLeaderBoard, LoyaltyPoint, LoyaltyScore, NextAirdrop, PrizePool } from '../../../models/loyalty.model'
import { ToasterService } from '../../../services';



@Injectable({
  providedIn: 'root'
})
export class LoyaltyService {
  protected api = this._utilsService.serverlessAPI + '/api/loyalty-points'
  constructor(
    private _utilsService: UtilsService,
    private _apiService: ApiService,
    private _toasterService:ToasterService
  ) { }

  private _formatErrors(error: any) {
    console.warn('my err', error)
    this._toasterService.msg.next({
      message: error.message || 'fail to load loyalty program',
      segmentClass: "toastError",
    });
    return throwError((() => error))
  }
  public getNextAirdrop(): Observable<NextAirdrop> {
    return this._apiService.get(`${this.api}/get-next-airdrop`).pipe(
      this._utilsService.isNotNull,
      map((nextAirdrop: NextAirdrop) => {
        return nextAirdrop
      }),
      shareReplay(),
      catchError((err) => this._formatErrors(err))
    )
  }
  public getLoyaltyScore(): Observable<LoyaltyScore> {
    return this._apiService.get(`${this.api}/score`).pipe(
      shareReplay(),
      this._utilsService.isNotNull,
      map((loyaltyScore: LoyaltyScore) => {
        return loyaltyScore
      }),
      catchError((err) => this._formatErrors(err))
    )
  }
  public getLoyaltyLeaderBoard(): Observable<LoyaltyLeaderBoard> {
    return this._apiService.get(`${this.api}/leader-board`).pipe(
      this._utilsService.isNotNull,
      map((loyaltyLeaderBoard: LoyaltyLeaderBoard) => {
        return loyaltyLeaderBoard
      }),
      shareReplay(),
      catchError((err) => this._formatErrors(err))
    )
  }
  public getPrizePool(): Observable<PrizePool> {
    return this._apiService.get(`${this.api}/prize-pool`).pipe(
      this._utilsService.isNotNull,
      map((prizePool: PrizePool) => {
        return prizePool
      }),
      shareReplay(),
      catchError((err) => this._formatErrors(err))
    )
  }
}
