import { Component, OnInit, ViewChild } from '@angular/core';

import { IonPopover, MenuController } from '@ionic/angular';
import { pages } from '../shared/helpers/menu';
import { SolanaUtilsService } from '../services';
import { PrizePool } from '../models/loyalty.model';
import { Observable, firstValueFrom, map, shareReplay, switchMap, tap } from 'rxjs';
import { LoyaltyService } from '../loyalty/loyalty.service';
import { ValidatorData } from '../models';


@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.page.html',
  styleUrls: ['./side-menu.page.scss'],
})
export class SideMenuPage implements OnInit {
  @ViewChild('popover') popover:IonPopover;
  public validatorAPY$:Observable<number> = this._loyaltyService.getPrizePool().pipe(

    switchMap(async res => {
      const validatorInfo:ValidatorData | any = await firstValueFrom(this._solanaUtilsService.getValidatorData('7K8DVxtNJGnMtUY1CQJT5jcs8sFGSZTDiG7kowvFpECh'))
      const totalApy = validatorInfo.apy_estimate * (res.APR_boost + 1) / 100
      return totalApy
    } ),
    shareReplay())
  constructor(
    private _solanaUtilsService:SolanaUtilsService,
    private _menu: MenuController,
    private _loyaltyService:LoyaltyService
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

  pages = pages

  ngOnInit() {
  }
  isTncOpen = false;

  presentTncPopover(e?: Event) {
    this.popover.event = null;
    this.popover.cssClass = 'tncPopup'
    this.isTncOpen = true;
  }

  openTNC(){

  }
}
