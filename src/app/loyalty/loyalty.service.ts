import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { ApiService } from '../services/api.service';
import { UtilsService } from '../services/utils.service';
import { Observable, map } from 'rxjs';
import { LoyaltyLeaderBoard, AvalutoLoyaltyPoint } from '../models/avaulto-loyalty.model';



@Injectable({
  providedIn: 'root'
})
export class LoyaltyService {
  protected api = environment.serverlessAPI +'/api/loyalty-points'
  constructor(
    private _utilsService:UtilsService,
    private _apiService:ApiService
    ) { }
  public getLoyaltyLeaderBoard(): Observable<AvalutoLoyaltyPoint[]>{
    return this._apiService.get(`${this.api}/leader-board`).pipe(
      this._utilsService.isNotNull,
       map((loyaltyLeaderBoard: LoyaltyLeaderBoard) => {
        return loyaltyLeaderBoard.AvalutoLoyaltyPoints
       }) 
    )}
}
