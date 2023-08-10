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
  public runStatefulData: boolean = false;
  constructor(
    private _solanaUtilsService: SolanaUtilsService,
    private _solblazeFarmerService: SolblazeFarmerService,
    private _marinadePlusService: MarinadePlusService,
    private _utilsService:UtilsService,
    private _router: ActivatedRoute,
    private _jupiterStore: JupiterStoreService
  ) { }
  public userHoldings = { SOL: null, USD: null }
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
        this._jupiterStore.initJup(wallet)
        if (this.strategyName === 'marinade-plus') {
          // await this._marinadePlusService.initStrategyStatefulStats()
        }
        if (this.strategyName === 'solblaze-farmer') {
          this.fetchUserData()
      
          this._solblazeFarmerService.fetchUserHoldings$
          .pipe(this._utilsService.isNotUndefined, this._utilsService.isNotUndefined)
          .subscribe(async doFetch => {
            this.fetchUserData()
          })
        }
        return wallet;
      } else {
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
