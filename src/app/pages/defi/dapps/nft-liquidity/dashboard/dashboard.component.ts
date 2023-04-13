import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { SolanaUtilsService, UtilsService } from 'src/app/services';
import { FraktStoreService } from '../frakt-store.service';
import { AllUserStats } from '../frakt.model';

// import { utils, loans, pools } from '@frakt-protocol/frakt-sdk';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @Output() onSelectTab = new EventEmitter();
  constructor(
    private _solanaUtilsService: SolanaUtilsService,
    private _utilsService: UtilsService,
    private _fraktStoreService: FraktStoreService
  ) { }

  ngOnInit() {}
  public userStats$: Observable<AllUserStats> = this._solanaUtilsService.walletExtended$.pipe(
    switchMap(async wallet => {
      if(wallet){
        const userStats = await this._fraktStoreService.getAllUserStats(wallet.publicKey.toBase58())
        return userStats
      }else{
        return null
      }
    })
  )
}
