import { Component, OnInit } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { ApiService, UtilsService } from 'src/app/services';

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
  public fraktStats: Observable<FraktStats> = this._apiService.get('https://fraktion-monorep.herokuapp.com/stats/total').pipe(this._utilsService.isNotNull,shareReplay(1))

  constructor(private _utilsService: UtilsService,private _apiService: ApiService) { }

  ngOnInit() {}

}
