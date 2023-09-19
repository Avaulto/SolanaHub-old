import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { SolanaUtilsService, UtilsService } from 'src/app/services';
import { LoyaltyPopupComponent } from '../loyalty-popup/loyalty-popup.component';
import { LoyaltyService } from '../loyalty.service';
import { Observable, map } from 'rxjs';
import { LoyaltyLeaderBoard, LoyaltyPoint } from 'src/app/models/loyalty.model';

@Component({
  selector: 'app-loyalty-btn',
  templateUrl: './loyalty-btn.component.html',
  styleUrls: ['./loyalty-btn.component.scss'],
})
export class LoyaltyBtnComponent implements OnInit {
  private _loyaltyLeaderBoard: LoyaltyLeaderBoard
  constructor(
    private _utilsService: UtilsService,
    private _popoverController: PopoverController,
    private _loyaltyService:LoyaltyService,
    private _solanaUtilsService:SolanaUtilsService
  ) { }

  public loyaltyPersonalScore$: Observable<string> = this._loyaltyService.getLoyaltyLeaderBoard().pipe(
    map(res => {
      this._loyaltyLeaderBoard = res;
      return this._utilsService.formatBigNumbers(
      res.loyaltyPoints.find(s => s.walletOwner === this._solanaUtilsService.getCurrentWallet().publicKey.toBase58()
      
      )?.loyaltyPoints || 0)}
    ))
  

  async openLoyaltyPopup() {
    const popover = await this._popoverController.create({
      component: LoyaltyPopupComponent,
      componentProps: {loyaltyLeaderBoard: this._loyaltyLeaderBoard},
      // event: e,
      alignment: 'start',
      // showBackdrop:false,
      backdropDismiss: true,
      // dismissOnSelect: true,
      cssClass: 'loyalty-points-popup',
    });
    await popover.present();

  }

  ngOnInit() {
    const RANDOM = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)
    const PARTICLES = document.querySelectorAll('.particle')
    PARTICLES.forEach(P => {
      P.setAttribute('style', `
		--x: ${RANDOM(20, 80)};
		--y: ${RANDOM(20, 80)};
		--duration: ${RANDOM(6, 20)};
		--delay: ${RANDOM(1, 10)};
		--alpha: ${RANDOM(40, 90) / 100};
		--origin-x: ${Math.random() > 0.5 ? RANDOM(300, 800) * -1 : RANDOM(300, 800)}%;
		--origin-y: ${Math.random() > 0.5 ? RANDOM(300, 800) * -1 : RANDOM(300, 800)}%;
		--size: ${RANDOM(40, 90) / 100};
	`)
    })
  }

}
