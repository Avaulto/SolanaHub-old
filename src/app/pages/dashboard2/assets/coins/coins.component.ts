import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { SolanaUtilsService, TxInterceptService, UtilsService } from 'src/app/services';
import { SendComponent } from '../send/send.component';
import { Asset, ValidatorData } from 'src/app/models';
import { StakeBoxComponent } from 'src/app/shared/components';
import { Observable, firstValueFrom, map, shareReplay, switchMap } from 'rxjs';
import { LoyaltyService } from 'src/app/pages/stake-with-us/loyalty/loyalty.service';


@Component({
  selector: 'app-coins',
  templateUrl: './coins.component.html',
  styleUrls: ['./coins.component.scss'],
})
export class CoinsComponent implements OnInit {
  @Input('coins') coins: Asset[] | any = null;
  totalCoinsValue = 0
  constructor(
    private _popoverController: PopoverController,
    private _utilsService: UtilsService,
    private _txInterceptService: TxInterceptService,
    private _solanaUtilsService: SolanaUtilsService,
  ) { }

  ngOnInit() { }
  ngOnChanges(changes): void {
    if (this.coins) {
      this.coins = this.coins
      this.totalCoinsValue = this.coins.value
    }

    // console.log(this.coins);

  }
  formatNumber = n => {
    return this._utilsService.formatBigNumbers(n);
  };

  async openSendPopup(coin) {

    const popover = await this._popoverController.create({
      component: SendComponent,
      componentProps: { coin },
      // event: e,
      alignment: 'start',
      // showBackdrop:false,
      backdropDismiss: true,
      // dismissOnSelect: true,
      cssClass: 'send-asset-popup',
    });

    await popover.present();
  }
  async openStakePopup() {
    const validatorsData: Observable<ValidatorData[] | any> = this._solanaUtilsService.getValidatorData().pipe(
      switchMap(async (data: ValidatorData[]) => {
        const SolanaHubVoteKey: string = '7K8DVxtNJGnMtUY1CQJT5jcs8sFGSZTDiG7kowvFpECh';
        const sortedList = data.sort(function (x, y) { return x.vote_identity == SolanaHubVoteKey ? -1 : y.vote_identity == SolanaHubVoteKey ? 1 : 0; });
        return sortedList
      }),
      shareReplay(1),
    )
    const popover = await this._popoverController.create({
      component: StakeBoxComponent,
      componentProps: { validatorsData },
      // event: e,
      alignment: 'start',
      // showBackdrop:false,
      backdropDismiss: true,
      // dismissOnSelect: true,
      cssClass: 'stake-popup',
    });
    await popover.present();
  }
}
