import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { SolanaUtilsService, UtilsService } from 'src/app/services';
import { FraktStoreService } from '../../frakt-store.service';
import { AllUserStats, UserRewards } from '../../frakt.model';

@Component({
  selector: 'app-active-deposits',
  templateUrl: './active-deposits.component.html',
  styleUrls: ['./active-deposits.component.scss'],
})
export class ActiveDepositsComponent  implements OnInit {
  @Output() onSelectTab = new EventEmitter();
  @Input() userStats: AllUserStats;
  constructor(
    private _solanaUtilsService: SolanaUtilsService,
    private _fraktStoreService: FraktStoreService
    ) { }

 
  public userRewards$: Observable<UserRewards> = this._solanaUtilsService.walletExtended$.pipe(
    switchMap(async wallet => {
      if(wallet){
        const userRewards = await this._fraktStoreService.getUserRewards(wallet.publicKey.toBase58())
        return userRewards
      }else{
        return null
      }
    })
  )
  ngOnInit() {}

}
