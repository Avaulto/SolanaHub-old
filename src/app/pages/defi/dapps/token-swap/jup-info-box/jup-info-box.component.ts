import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, UtilsService } from 'src/app/services';

interface JupiterStats {
  lastXVolumeInUSD: string;
  lastXTransactionsCount: string;
  lastXAddressesCount: string;
  lastXRoutingsCount: string;
  volumeInUSD: [],

}
@Component({
  selector: 'app-jup-info-box',
  templateUrl: './jup-info-box.component.html',
  styleUrls: ['./jup-info-box.component.scss'],
})
export class JupInfoBoxComponent implements OnInit {
  public jupInfo: JupiterStats = {} as JupiterStats;
  public showLoader = true;
  constructor(
    private _apiService: ApiService,
    private _utilsService: UtilsService
    ) { }

  ngOnInit() {
    this._apiService.get('https://cache.jup.ag/stats/day').pipe(this._utilsService.isNotNull).subscribe((stats: JupiterStats) => 
    { 
      this.showLoader = false;
      stats.lastXVolumeInUSD = Number(stats.lastXVolumeInUSD).toLocaleString()
      stats.lastXTransactionsCount = stats.lastXTransactionsCount.toLocaleString();
      stats.lastXAddressesCount = stats.lastXAddressesCount.toLocaleString();
      stats.lastXRoutingsCount = stats.lastXRoutingsCount.toLocaleString();
      this.jupInfo = stats
    })
  }

}
