import { Component, OnInit } from '@angular/core';
import {  JupiterStoreService, SolanaUtilsService} from 'src/app/services';
import { Observable, shareReplay, switchMap } from 'rxjs';
import { DefiStat, LabStrategyConfiguration, WalletExtended } from 'src/app/models';

import { MarinadePlusService } from '../strategies-builder/marinade-plus.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-basic-template',
  templateUrl: './basic-template.page.html',
  styleUrls: ['./basic-template.page.scss'],
})
export class BasicTemplatePage implements OnInit {
  public strategyConfiguration: LabStrategyConfiguration = {} as LabStrategyConfiguration;
  public menu: string[] = ['deposit', 'withdraw', 'claim'];
  public currentTab: string = this.menu[0];
  public strategyStats: DefiStat[] = this._marinadePlusService.strategyStats;
  constructor(
    private _solanaUtilsService: SolanaUtilsService,
    private _marinadePlusService: MarinadePlusService,
    private _router: ActivatedRoute,
    private _jupiterStore: JupiterStoreService
  ) { }
  public strategyName: string = '';
  async ionViewWillEnter() {
    this.strategyName = this._router.snapshot.paramMap.get('strategy')
    if (this.strategyName === 'marinade-plus') {
      this._marinadePlusService.initStrategyStats();
      this.strategyConfiguration = this._marinadePlusService.strategyConfiguration
    }
  }
  public walletExtended$: Observable<WalletExtended> = this._solanaUtilsService.walletExtended$.pipe(
    switchMap(async (wallet) => {
      if (wallet) {
        this._jupiterStore.initJup(wallet)
        if (this.strategyName === 'marinade-plus') {
          await this._marinadePlusService.initStrategyStatefulStats()
        }
        return wallet;
      } else {
        return null
      }
    }), shareReplay(),
  )


  ngOnInit() {
  }

}
