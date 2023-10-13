import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { PortfolioElementMultiple } from '@sonarwatch/portfolio-core';
import { ConvertBalancePopupComponent } from './coins/convert-balance-popup/convert-balance-popup.component';
import { PopoverController } from '@ionic/angular';
import { Asset } from 'src/app/models';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss'],
})
export class AssetsComponent  implements OnInit,OnChanges {
  public menu: string[] = ['Coins', 'NFTs'];
  public currentTab: string = this.menu[0]
  @Input('portfolioSPL') portfolioSPL = null;
  public coins: Asset[] = []
  public NFTs: any[] = []
  constructor(private _popoverController:PopoverController) { }

  ngOnInit() {}

  ngOnChanges(changes): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if(this.portfolioSPL){

      this.coins = this.portfolioSPL.find(group => group.platformId === 'wallet-tokens').data.assets
      this.NFTs = this.portfolioSPL.find(group => group.platformId === 'wallet-nfts')
    }else{
      this.coins = null
      this.NFTs = null
    }
  }
  async openSwapSmallBalancePopup() {
    const popover = await this._popoverController.create({
      component: ConvertBalancePopupComponent,
      componentProps: { assets: this.coins, },
      // event: e,
      alignment: 'start',
      // showBackdrop:false,
      backdropDismiss: true,
      // dismissOnSelect: true,
      cssClass: 'merge-accounts-popup',
    });
    await popover.present();

  }
}
