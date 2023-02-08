import { Component, OnInit } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { ApiService, UtilsService } from 'src/app/services';
import { FraktStoreService } from '../frakt-store.service';

interface FraktStats{
  totalIssued: number,
  loansTvl: number,
  loansVolumeAllTime: number,
  activeLoansCount: number
}
@Component({
  selector: 'app-frakt-stats',
  templateUrl: './frakt-stats.component.html',
  styleUrls: ['./frakt-stats.component.scss'],
})
export class FraktStatsComponent implements OnInit {
  public fraktStats: Observable<FraktStats> = this._fraktStore.fetchStats();

  constructor(private _fraktStore: FraktStoreService) { }

  ngOnInit() {}

}
