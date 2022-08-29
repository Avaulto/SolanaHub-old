import { Component, OnInit, ViewChild } from '@angular/core';
import { ConnectionStore, WalletStore } from '@heavy-duty/wallet-adapter';
import { MenuController, PopoverController } from '@ionic/angular';
import { WalletName } from '@solana/wallet-adapter-base';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { map } from 'rxjs';
import { ToasterService, UtilsService } from 'src/app/services';
import { WalletAdapterOptionsComponent } from '../wallet-adapter-options/wallet-adapter-options.component';
import { WalletConnectedDropdownComponent } from '../wallet-connected-dropdown/wallet-connected-dropdown.component';

@Component({
  selector: 'app-wallet-connect',
  templateUrl: './wallet-connect.component.html',
  styleUrls: ['./wallet-connect.component.scss'],
})
export class WalletConnectComponent implements OnInit {
  public isOpenModal: boolean = false;
  readonly wallets$ = this._walletStore.wallets$;
  readonly wallet$ = this._walletStore.wallet$;
  readonly isReady$ = this._walletStore.connected$
  public walletPublicKey:string = '';


  constructor(
    private utilsService: UtilsService,
    private _walletStore: WalletStore,
    private toasterService: ToasterService,
    public popoverController: PopoverController,
    private gaService: GoogleAnalyticsService
  ) { }
  ngOnInit() {
    let ready = false;
    this.isReady$.subscribe(isReady => {
      if (isReady) {
        this.gaService.event('wallet_event', 'user_connect_wallet', 'wallet_connected');
        ready = isReady
        this.toasterService.msg.next({
          message: 'Wallet connected',
          icon: 'information-circle-outline',
          segmentClass: "toastInfo"
        })
      }
    });
    this._walletStore.wallet$.subscribe(val => {
      if (val) {
        if (val.readyState == 'NotDetected') {
          this.toasterService.msg.next({
            message: 'Wallet not detected',
            icon: 'alert-circle-outline',
            segmentClass: "toastError"
          })
        }
      }
    })
    this._walletStore.anchorWallet$.subscribe(wallet => {
      if (wallet) {
        this.walletPublicKey = this.utilsService.addrUtil(wallet.publicKey.toBase58()).addrShort
      }
    })
  }

  onConnect() {
    this._walletStore.connect().subscribe();
  }

  onDisconnect() {
    this._walletStore.disconnect().subscribe();
  }
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
