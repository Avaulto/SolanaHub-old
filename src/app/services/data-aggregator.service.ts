import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CoinData } from '../models';
import { ApiService } from './api.service';
import { ToasterService } from './toaster.service';

@Injectable({
  providedIn: 'root'
})
export class DataAggregatorService {
  constructor(private apiService: ApiService,private toasterService: ToasterService) { }
  // catch error
  private _formatErrors(error: any) {
    this.toasterService.msg.next({
      message: error.error,
      icon:'alert-circle-outline',
      segmentClass: "toastError",
    });
    return throwError(error);
  }
  
  protected _coinGecoAPI = 'https://api.coingecko.com/api/v3'
  public getCoinData(coinName: string, localization: boolean = false): Observable<CoinData>{
    return this.apiService.get(`${this._coinGecoAPI}/coins/${coinName}?localization=${localization}`).pipe(
      map((data) => {
        const {links, image,market_data, description} = data;
        const coinInfo: CoinData = {
          name: coinName,
          desc: description.en,
          price: {btc: market_data.current_price.btc.toFixed(3),usd: market_data.current_price.usd.toFixed(2)},
          website: links.homepage[0],
          image,
          price_change_percentage_24h_in_currency: {btc: market_data.price_change_percentage_24h_in_currency.btc.toFixed(1), usd: market_data.price_change_percentage_24h_in_currency.usd.toFixed(1)}
        }
        return coinInfo;
      }),
      catchError((error) => this._formatErrors(error))
    );
  }
}
