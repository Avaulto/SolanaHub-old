import { Component, OnInit, ViewChild } from '@angular/core';
import { ConnectionStore, WalletStore } from '@heavy-duty/wallet-adapter';
import { MenuController, PopoverController } from '@ionic/angular';
import { WalletName } from '@solana/wallet-adapter-base';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { distinctUntilChanged, map, Observable, of, switchMap } from 'rxjs';
import { ToasterService, UtilsService } from 'src/app/services';
import { WalletAdapterOptionsComponent } from './wallet-adapter-options/wallet-adapter-options.component';
import { WalletConnectedDropdownComponent } from './wallet-connected-dropdown/wallet-connected-dropdown.component';

import Plausible from 'plausible-tracker'
const { trackEvent } = Plausible()
@Component({
  selector: 'app-wallet-connect',
  templateUrl: './wallet-connect.component.html',
  styleUrls: ['./wallet-connect.component.scss'],
})
export class WalletConnectComponent implements OnInit {
  readonly wallets$ = this._walletStore.wallets$;
  readonly wallet$ = this._walletStore.wallet$;
  readonly isReady$ = this._walletStore.connected$.pipe(map(isReady => {
    console.log(isReady)
    if (isReady) {
      trackEvent('Wallet connected')
  
      this.toasterService.msg.next({
        message: 'Wallet connected',
        icon: 'information-circle-outline',
        segmentClass: "toastInfo"
      })
    }
    return isReady;
  }))
  public walletPublicKey: Observable<string> = this._walletStore.anchorWallet$.pipe(
    this.utilsService.isNotNull,
    distinctUntilChanged(),
    map(wallet => this.utilsService.addrUtil(wallet.publicKey.toBase58()).addrShort)
  )

  constructor(
    private utilsService: UtilsService,
    private _walletStore: WalletStore,
    private toasterService: ToasterService,
    public popoverController: PopoverController,
  ) { }
  ngOnInit() {

    // this.wallet$.subscribe(val => {
    //   if (val) {
    //     if (val.readyState == 'NotDetected') {
    //       this.toasterService.msg.next({
    //         message: 'Wallet not detected',
    //         icon: 'alert-circle-outline',
    //         segmentClass: "toastError"
    //       })
    //     }
    //   }
    // })
  }

  // onConnect() {
  //   this._walletStore.connect().subscribe();
  // }

  // onDisconnect() {
  //   this._walletStore.disconnect().subscribe();
  // }
  async showWalletAdapters() {
    const popover = await this.popoverController.create({
      component: WalletAdapterOptionsComponent,
      cssClass: 'wallet-adapter-options'
    });
    await popover.present();
  }
  async showConnectWalletActions(e: Event) {
    const popover = await this.popoverController.create({
      component: WalletConnectedDropdownComponent,
      event: e,
      alignment: 'start',
      side: 'top',
      cssClass: 'wallet-connect-dropdown'
    });
    await popover.present();
  }
}
