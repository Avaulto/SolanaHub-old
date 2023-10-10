import { Component, OnInit, ViewChild } from '@angular/core';

import { IonPopover, MenuController } from '@ionic/angular';
import { pages } from '../shared/helpers/menu';
import { SolanaUtilsService } from '../services';
import { PrizePool } from '../models/loyalty.model';
import { Observable, firstValueFrom, forkJoin, map, shareReplay, switchMap, tap } from 'rxjs';
import { LoyaltyService } from '../loyalty/loyalty.service';
import { ValidatorData } from '../models';


@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.page.html',
  styleUrls: ['./side-menu.page.scss'],
})
export class SideMenuPage implements OnInit {
  @ViewChild('popover') popover: IonPopover;
  public prizePool: PrizePool;
  public validatorAPY$: Observable<number> = forkJoin({
    prizePool: this._loyaltyService.getPrizePool(),
    validatorInfo: this._solanaUtilsService.getValidatorData('7K8DVxtNJGnMtUY1CQJT5jcs8sFGSZTDiG7kowvFpECh')
  }).pipe(
    map((data) => {
      this.prizePool = data.prizePool;
      const validatorInfo: ValidatorData | any =  data.validatorInfo
      const totalApy = validatorInfo.apy_estimate * (this.prizePool.APR_boost + 1) / 100;
      return totalApy
    }))


  constructor(
    private _solanaUtilsService: SolanaUtilsService,
    private _menu: MenuController,
    private _loyaltyService: LoyaltyService
  ) {
    this.openFirst()
  }
  public wallet$ = this._solanaUtilsService.walletExtended$
  openFirst() {
    this._menu.enable(true, 'first');
    this._menu.open('first');
  }

  openEnd() {
    this._menu.open('end');
  }
  closeMenu() {
    this._menu.close()
  }
  pages = pages

  ngOnInit() {
  }
  isTncOpen = false;

  presentTncPopover(e?: Event) {
    this.popover.event = null;
    this.popover.cssClass = 'tncPopup'
    this.isTncOpen = true;
  }

  openTNC() {

  }
}
