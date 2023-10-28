import { Component, OnInit } from '@angular/core';
import { SolendStoreService } from '../solend-store.service';
import { JupiterStoreService, SolanaUtilsService, UtilsService } from 'src/app/services';
import { Observable, combineLatestWith, firstValueFrom, map, switchMap } from 'rxjs';
import { Asset, Token, WalletExtended } from 'src/app/models';
import { SolendObligation } from '@solendprotocol/solend-sdk';
import { TooltipPosition } from 'src/app/shared/layouts/tooltip/tooltip.enums';
import { ActionsPopupComponent } from '../actions-popup/actions-popup.component';
import { PopoverController } from '@ionic/angular';


@Component({
  selector: 'app-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.scss'],
})
export class PositionsComponent implements OnInit {
  position: TooltipPosition = TooltipPosition.LEFT;
  public walletObligations$: Observable<SolendObligation | any> = this._solanaUtilsService.walletExtended$.pipe(
    combineLatestWith(this._solendStore.solendSDK$),
    switchMap(async ([wallet, solendSDK]) => {
      if (wallet && solendSDK) {
  
        // add icon and name for tokens
        const tokensInfo = await firstValueFrom(this._jupStore.fetchTokenList());
        const obligation = await solendSDK.fetchObligationByWallet(wallet.publicKey);
        // console.log(obligation)
        this._addTokenData(obligation.deposits, tokensInfo)
        this._addTokenData(obligation.borrows, tokensInfo)
        return obligation
      } else {
        return null
      }
    }
    ))
  // this._solendStore.solendSDK$.pipe(
  //   this._utilsService.isNotNull,
  //   map(async () => {
  //     const obligation = await  this._solendStore.getWalletObligations();
  //     console.log(obligation)
  //     return obligation
  //   })
  // )
  constructor(
    private _solanaUtilsService: SolanaUtilsService,
    private _solendStore: SolendStoreService,
    private _utilsService: UtilsService,
    private _jupStore: JupiterStoreService,
    private _popoverController: PopoverController
  ) { }

  ngOnInit() { }
  private _addTokenData(assets, tokensInfo: Token[]): Asset[] {
    return assets.map(res => {
      res.mintAddress === "11111111111111111111111111111111" ? res.mintAddress = "So11111111111111111111111111111111111111112" : res.mintAddress
      // const { symbol, name, logoURI, decimals } = tokensInfo.find(token => token.address === res.data.address)
      const token = tokensInfo.find(token => token.address === res.mintAddress)
      res.decimals = token?.decimals ? token.decimals : '';;
      res.balance =  Number(res.amount.toString()) / 10 ** res.decimals
      res.name = token?.name ? token.name : '';
      res.symbol = token?.symbol ? token.symbol : '';
      res.icon = token?.logoURI ? token.logoURI : '';;
      return res
    })
  }
  formatNumber = n => {
    return this._utilsService.formatBigNumbers(n);
  };
  async openLendAndBorrowPopup(coin:Asset, popupType:string) {
    console.log(coin)
    const asset = {
      logo:coin.icon,
      balance:coin.balance,
      symbol:coin.symbol,
      decimals: coin.decimals,
      mintAddress:coin.mintAddress
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
}
