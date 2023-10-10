import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js';
import { PortfolioService } from './portfolio.service';
import { SolanaUtilsService, UtilsService } from 'src/app/services';
import { Observable, map, of, shareReplay, switchMap } from 'rxjs';

import { WalletExtended } from 'src/app/models';
import { PortfolioElementMultiple } from '@sonarwatch/portfolio-core';

@Component({
  selector: 'app-dashboard2',
  templateUrl: './dashboard2.page.html',
  styleUrls: ['./dashboard2.page.scss'],
})
export class Dashboard2Page implements OnInit {

  public walletPortfolio$: Observable<PortfolioElementMultiple[]> = this._solanaUtilsService.walletExtended$.pipe(

    switchMap((wallet: WalletExtended) => {
      if (wallet) {
        // console.log(wallet, this._portfolio.getPortfolio(wallet.publicKey.toBase58()));
        return this._portfolio.getPortfolio(wallet.publicKey.toBase58())
      } else {
        return of(null);
      }
    }),
    shareReplay(1)
  );
  public portfolioSPL$ = this.walletPortfolio$.pipe(
    this._utilsService.isNotUndefined,
    map(
      (assets) => {
        if (assets) {
          const SPLs = assets.filter(group => group.platformId === 'wallet-tokens' || group.platformId === 'wallet-nfts')
          return SPLs
        } else {
          return null
        }
      }));
  constructor(
    private _solanaUtilsService: SolanaUtilsService,
    private _portfolio: PortfolioService,
    private _utilsService: UtilsService
  ) { }
  ngOnInit(): void {

  }
}
