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
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  readonly isReady$ = this._walletStore.connected$
  constructor(
    public router:Router,
    private _connectionStore: ConnectionStore,
    private _walletStore: WalletStore
  ) { }
  async ngOnInit(): Promise<void> {
    // this.userService.populate();
    // mb-avaulto-cc28.mainnet.rpcpool.com/f72a3ed2-f282-4523-95a0-d4acfcd40f4d
    // 'https://dawn-chaotic-butterfly.solana-mainnet.discover.quiknode.pro/e3aa076aff3f4a6b638c3599348ab5f56fde2a12/'
    this._connectionStore.setEndpoint(environment.solanaCluster) ;
    // this._connectionStore.setEndpoint('https://dawn-chaotic-butterfly.solana-mainnet.discover.quiknode.pro/e3aa076aff3f4a6b638c3599348ab5f56fde2a12');
    this._connectionStore.state$.subscribe(val=>console.log(val.endpoint))
    this._walletStore.setAdapters([
      new PhantomWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter(),
      new SolletExtensionWalletAdapter(),
      new SolletWalletAdapter()
    ]);

  }
  

}
