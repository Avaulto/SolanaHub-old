import { Component, OnInit } from '@angular/core';
import { JupiterStoreService, SolanaUtilsService, UtilsService } from 'src/app/services';
import { Observable, shareReplay, switchMap } from 'rxjs';
import { DefiStat, LabStrategyConfiguration, WalletExtended } from 'src/app/models';

import { MarinadePlusService } from '../strategies-builder/marinade-plus.service';
import { ActivatedRoute } from '@angular/router';
import { SolblazeFarmerService } from '../strategies-builder/solblaze-farmer.service';

@Component({
  selector: 'app-basic-template',
  templateUrl: './basic-template.page.html',
  styleUrls: ['./basic-template.page.scss'],
})
export class BasicTemplatePage implements OnInit {
  public strategyConfiguration: LabStrategyConfiguration = {} as LabStrategyConfiguration;
  public menu: string[] = ['deposit', 'withdraw', 'claim'];
  public currentTab: string = this.menu[0];
  public apy: number = 0;
  public strategyName: string = '';
  constructor(
    private _solanaUtilsService: SolanaUtilsService,
    private _solblazeFarmerService: SolblazeFarmerService,
    private _utilsService:UtilsService,
    private _router: ActivatedRoute,
  ) { }
  public userHoldings = { SOL: 0, USD: 0 }
  async ionViewWillEnter() {
    this.strategyName = this._router.snapshot.paramMap.get('strategy')
    if (this.strategyName === 'solblaze-farmer') {
    this.strategyConfiguration = this._solblazeFarmerService.strategyConfiguration
    }
  }
ngOnInit(): void {
  
}

  public walletExtended$: Observable<WalletExtended> = this._solanaUtilsService.walletExtended$.pipe(
    switchMap(async (wallet) => {
      if (wallet) {
        if (this.strategyName === 'marinade-plus') {
          // await this._marinadePlusService.initStrategyStatefulStats()
        }
        if (this.strategyName === 'solblaze-farmer') {
          this.userHoldings = { SOL: null, USD: null }
          this.fetchUserData()
      
          this._solblazeFarmerService.fetchUserHoldings$
          .pipe(this._utilsService.isNotUndefined, this._utilsService.isNotUndefined)
          .subscribe(async doFetch => {
            this.fetchUserData()
          })
        }
        return wallet;
      } else {
        this.userHoldings = { SOL: 0, USD: 0 }
        return null
      }
    }),
    shareReplay(),
  )

  async fetchUserData(){
    const {userHoldings, strategyConfiguration} = await this._solblazeFarmerService.initStrategyStatefulStats()
    this.strategyConfiguration = strategyConfiguration
    this.userHoldings = userHoldings
  }

}
