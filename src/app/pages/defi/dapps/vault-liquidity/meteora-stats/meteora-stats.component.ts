import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MeteoraStoreService } from '../meteora-store.service';
import { MeteoraStats, VaultsInfo } from '../meteroa.model';

@Component({
  selector: 'app-meteora-stats',
  templateUrl: './meteora-stats.component.html',
  styleUrls: ['./meteora-stats.component.scss'],
})
export class MeteoraStatsComponent  implements OnInit {

  public meteoraStats: Observable<MeteoraStats> = this._meteoraStore.fetchStats();

  constructor(private _meteoraStore: MeteoraStoreService) { }

  ngOnInit() {}

}
