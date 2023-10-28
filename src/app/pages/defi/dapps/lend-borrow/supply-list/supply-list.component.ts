import { Component, Input, OnInit } from '@angular/core';
import { Observable, map, shareReplay, switchMap, tap } from 'rxjs';
import { Market, Pool } from '../solend.model';
import { SolendStoreService } from '../solend-store.service';
import { SolendMarket, SolendReserve } from '@solendprotocol/solend-sdk';
import { UtilsService } from 'src/app/services';
import { ActionsPopupComponent } from '../actions-popup/actions-popup.component';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-supply-list',
  templateUrl: './supply-list.component.html',
  styleUrls: ['./supply-list.component.scss'],
})
export class SupplyListComponent  implements OnInit {
  @Input() currentTab: string = 'supply'
  constructor(
    private _popoverController:PopoverController,
    private _utilsService:UtilsService,
    private _solendStore:SolendStoreService) { }

  ngOnInit() {}
  async openLendAndBorrowPopup(pool:SolendReserve, popupType:string) {
    const asset = {
      logo:pool.config.liquidityToken.logo,
      symbol:pool.config.liquidityToken.symbol,
      decimals:pool.config.liquidityToken.decimals,
      loanToValueRatio: pool.stats.loanToValueRatio,
      borrowFeePercentage:pool.stats.borrowFeePercentage,
      assetPriceUSD: pool.stats.assetPriceUSD,
      mintAddress:pool.config.liquidityToken.mint
    }
    const popover = await this._popoverController.create({
      component: ActionsPopupComponent,
      componentProps: { asset, popupType },
      // event: e,
      alignment: 'start',
      // showBackdrop:false,
      backdropDismiss: true,
      // dismissOnSelect: true,
      cssClass: 'lend-and-borrow-popup',
    });
    await popover.present();

  }
  public supplyList$: Observable<SolendReserve[] | any> = this._solendStore.solendSDK$.pipe(
    this._utilsService.isNotNull,
    map(market =>  market.reserves.map(pool => pool).filter(pool => pool.stats.symbol.toLowerCase() == 'bsol' || pool.stats.loanToValueRatio)),
    tap(m => {
      m.map(p => {
// console.log(p)
        // const slot = 500;
        // const solendAvg30daysSupplyAPY = p.stats.supplyInterestAPY * 413 / slot
        // const solendAvg30daysBorrowAPY = p.stats.borrowInterestAPY * 413 / slot
        // p.stats.supplyInterestAPY = solendAvg30daysSupplyAPY
        // p.stats.borrowInterestAPY = solendAvg30daysBorrowAPY
      //@ts-ignore
      p.stats.totalDeposits = Number(p.stats.totalDepositsWads.toString())/ 10 ** 18 / 10 ** p.stats.decimals
      //@ts-ignore
      p.stats.totalBorrows = Number(p.stats.totalBorrowsWads.toString()) / 10 ** 18 / 10 ** p.stats.decimals
    })
    return m
  }),
    shareReplay(1)
  )
}
