import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { ApiService } from './api.service';
import { UtilsService } from './utils.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoyaltyService {
  protected api = environment.serverlessAPI +'/api/loyalty-points/'
  constructor(
    private _utilsService:UtilsService,
    private _apiService:ApiService
    ) { }
  public getLoyaltyScore(){
    return this._apiService.get(`${this.api}/leader-board`).pipe(
      this._utilsService.isNotNull,
       map(loyalty => {

       }) 
    )}
}
