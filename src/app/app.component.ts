import { Component } from '@angular/core';
import { connectionConfigProviderFactory, ConnectionStore, WalletStore } from '@heavy-duty/wallet-adapter';
import {
  BackpackWalletAdapter,
  BraveWalletAdapter,
  ExodusWalletAdapter,
  GlowWalletAdapter,
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter
} from '@solana/wallet-adapter-wallets';
import { environment } from 'src/environments/environment.prod';
import { Router } from '@angular/router';
import { distinctUntilChanged } from 'rxjs';
import { SolanaUtilsService, UtilsService } from './services';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  // readonly isReady$ = this._walletStore.connected$
  constructor(
    public router: Router,
    private _connectionStore: ConnectionStore,
    private _walletStore: WalletStore,
    private _utilsService: UtilsService,
    private _solanaUtilsService: SolanaUtilsService
  ) { }
  async ngOnInit(): Promise<void> {
    this._walletStore.anchorWallet$.pipe(
      this._utilsService.isNotNull,
      this._utilsService.isNotUndefined,
      distinctUntilChanged(),
    ).subscribe(wallet => {
      this._solanaUtilsService.onAccountChangeCB(wallet.publicKey)
    })
    connectionConfigProviderFactory({
      commitment: "confirmed",
    })

    this._connectionStore.setEndpoint(environment.solanaCluster)
    this._walletStore.setAdapters([
      new PhantomWalletAdapter(),
      new BackpackWalletAdapter,
      new SolflareWalletAdapter(),
      new SlopeWalletAdapter(),
      new BraveWalletAdapter(),
      new GlowWalletAdapter(),
      new ExodusWalletAdapter(),
      new LedgerWalletAdapter()
    ]);

  }


}
