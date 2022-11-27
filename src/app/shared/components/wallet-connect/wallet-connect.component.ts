import { Component, OnInit, ViewChild } from '@angular/core';
import { ConnectionStore, WalletStore } from '@heavy-duty/wallet-adapter';
import { MenuController, PopoverController } from '@ionic/angular';
<<<<<<< HEAD
import { WalletName } from '@solana/wallet-adapter-base';
=======
>>>>>>> hotfix/0.2.1
import { distinctUntilChanged, map, Observable, of, shareReplay, switchMap } from 'rxjs';
import { ToasterService, UtilsService } from 'src/app/services';
import { WalletAdapterOptionsComponent } from './wallet-adapter-options/wallet-adapter-options.component';
import { WalletConnectedDropdownComponent } from './wallet-connected-dropdown/wallet-connected-dropdown.component';

import Plausible from 'plausible-tracker'
const { trackEvent } = Plausible();
@Component({
  selector: 'app-wallet-connect',
  templateUrl: './wallet-connect.component.html',
  styleUrls: ['./wallet-connect.component.scss'],
})
export class WalletConnectComponent implements OnInit {
  readonly wallets$ = this._walletStore.wallets$.pipe(shareReplay(1));
  readonly wallet$ = this._walletStore.wallet$.pipe(shareReplay(1));
  readonly isReady$ = this._walletStore.connected$.pipe(map(isReady => {
    if (isReady) {
      trackEvent('Wallet connected')

      this._toasterService.msg.next({
        message: 'Wallet connected',
        icon: 'information-circle-outline',
        segmentClass: "toastInfo"
      })
    }
    return isReady;
  }))
  public walletPublicKey: Observable<string> = this._walletStore.anchorWallet$.pipe(
    this._utilsService.isNotNull,
    this._utilsService.isNotUndefined,
    distinctUntilChanged(),
    map(wallet => this._utilsService.addrUtil(wallet.publicKey.toBase58()).addrShort)
  )

  constructor(
    private _utilsService: UtilsService,
    private _walletStore: WalletStore,
    private _toasterService: ToasterService,
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
  public async showWalletAdapters() {
    const popover = await this.popoverController.create({
      component: WalletAdapterOptionsComponent,
      cssClass: 'wallet-adapter-options'
    });
    await popover.present();
  }
  public async showConnectWalletActions(e: Event) {
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
