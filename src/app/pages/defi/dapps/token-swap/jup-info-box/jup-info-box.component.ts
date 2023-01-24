import { Component, OnInit } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { ApiService, UtilsService } from 'src/app/services';

interface JupiterStats {
  lastXVolumeInUSD: string;
  lastXTransactionsCount: string;
  lastXAddressesCount: string;
  x: string;
  lastXTopBuy?:any;
  totalVolumeInUSD: string

}
@Component({
  selector: 'app-jup-info-box',
  templateUrl: './jup-info-box.component.html',
  styleUrls: ['./jup-info-box.component.scss'],
})
export class JupInfoBoxComponent implements OnInit {
  public jupInfo: Observable<JupiterStats> = this._apiService.get('https://cache.jup.ag/stats/day').pipe(shareReplay(1),this._utilsService.isNotNull)

  // public jupInfo: JupiterStats = {} as JupiterStats;
  constructor(
    private _apiService: ApiService,
    private _utilsService: UtilsService
    ) { }

  ngOnInit() {
    //this._apiService.get('https://cache.jup.ag/stats/day').pipe(this._utilsService.isNotNull)
    // .subscribe((stats: JupiterStats) => 
    // { 
    //   this.showLoader = false;
    //   stats.totalVolumeInUSD = stats.totalVolumeInUSD.toLocaleString();
    //   stats.lastXTransactionsCount = stats.lastXTransactionsCount.toLocaleString();
    //   stats.lastXAddressesCount = stats.lastXAddressesCount.toLocaleString();
      
    //   this.jupInfo = stats
    // })
  }

}
