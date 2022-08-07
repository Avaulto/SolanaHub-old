import { Component } from '@angular/core';
import { ConnectionStore, WalletStore } from '@heavy-duty/wallet-adapter';
import { UserService } from './services';
import {
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  SolongWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  readonly isReady$ = this._walletStore.connected$
  constructor(
    private userService: UserService,
    private _connectionStore: ConnectionStore,
    private _walletStore: WalletStore
  ) { }
  async ngOnInit(): Promise<void> {
    // this.userService.populate();

    // this._connectionStore.setEndpoint(clusterApiUrl('devnet')) ;
    this._connectionStore.setEndpoint(clusterApiUrl('mainnet-beta'));

    this._walletStore.setAdapters([
      new PhantomWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter(),
      new SolletExtensionWalletAdapter(),
      new SolletWalletAdapter()
    ]);

  }
  

}
