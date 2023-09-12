import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { ApiService } from '../services/api.service';
import { UtilsService } from '../services/utils.service';
import { Observable, map } from 'rxjs';
import { LoyaltyLeaderBoard, LoyaltyPoint, PrizePool } from '../models/loyalty.model'



@Injectable({
  providedIn: 'root'
})
export class LoyaltyService {
  protected api = this._utilsService.serverlessAPI +'/api/loyalty-points'
  constructor(
    private _utilsService:UtilsService,
    private _apiService:ApiService
    ) { }
  public getLoyaltyLeaderBoard(): Observable<LoyaltyPoint[]>{
    return this._apiService.get(`${this.api}/leader-board`).pipe(
      this._utilsService.isNotNull,
       map((loyaltyLeaderBoard: LoyaltyLeaderBoard) => {
        return loyaltyLeaderBoard.loyaltyPoints
       }) 
    )}
    public getPrizePool(): Observable<number>{
      return this._apiService.get(`${this.api}/prize-pool`).pipe(
        this._utilsService.isNotNull,
         map((prizePool: PrizePool) => {
          return prizePool.totalRebates
         }) 
      )} 
}
