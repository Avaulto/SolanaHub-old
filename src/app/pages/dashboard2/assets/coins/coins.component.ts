import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { TxInterceptService, UtilsService } from 'src/app/services';
import { SendComponent } from '../send/send.component';
import { Asset } from 'src/app/models';

interface Coin {
  address: string
  amount: number
  price: number
  symbol: string
  logoURI: string
}

@Component({
  selector: 'app-coins',
  templateUrl: './coins.component.html',
  styleUrls: ['./coins.component.scss'],
})
export class CoinsComponent  implements OnInit {
  @Input('coins') coins: Asset[] | any = null;
  totalCoinsValue = 0
  constructor(
    private _popoverController: PopoverController,
    private _utilsService:UtilsService,
     private _txInterceptService:TxInterceptService) { }

  ngOnInit() {}
  ngOnChanges(changes): void {
    if(this.coins){
      this.coins = this.coins
      this.totalCoinsValue = this.coins.value
    }

    // console.log(this.coins);
    
  }
  formatNumber = n => {
    return this._utilsService.formatBigNumbers(n) ;
  };

  async openSendPopup(coin) {
    const popover = await this._popoverController.create({
      component: SendComponent,
      componentProps: {coin},
      // event: e,
      alignment: 'start',
      // showBackdrop:false,
      backdropDismiss: true,
      // dismissOnSelect: true,
      cssClass: 'send-asset-popup',
    });

    await popover.present();
  }
}
