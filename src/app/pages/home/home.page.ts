import { Component } from '@angular/core';
import { WalletStore } from '@heavy-duty/wallet-adapter';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  readonly isReady$ = this._walletStore.connected$
  constructor(
    private _walletStore: WalletStore
  ) {
    this.isReady$.subscribe(val =>console.log(val))
   }
}
