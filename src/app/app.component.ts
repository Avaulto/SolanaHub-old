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
    // mb-avaulto-cc28.mainnet.rpcpool.com/f72a3ed2-f282-4523-95a0-d4acfcd40f4d
    // 'https://dawn-chaotic-butterfly.solana-mainnet.discover.quiknode.pro/e3aa076aff3f4a6b638c3599348ab5f56fde2a12/'
    // this._connectionStore.setEndpoint(clusterApiUrl('devnet')) ;
    this._connectionStore.setEndpoint('https://mb-avaulto-cc28.mainnet.rpcpool.com/f72a3ed2-f282-4523-95a0-d4acfcd40f4d');

    this._walletStore.setAdapters([
      new PhantomWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter(),
      new SolletExtensionWalletAdapter(),
      new SolletWalletAdapter()
    ]);

  }
  

}
