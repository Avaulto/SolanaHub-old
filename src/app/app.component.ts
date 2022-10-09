import { Component } from '@angular/core';
import { connectionConfigProviderFactory, ConnectionStore, WalletStore } from '@heavy-duty/wallet-adapter';
import {
  ExodusWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HyperspaceClient } from 'hyperspace-client-js';
import { SortOrderEnum, TimePeriodEnum } from 'hyperspace-client-js/dist/sdk';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public showTabs: boolean = false;
  readonly isReady$ = this._walletStore.connected$
  constructor(
    public router:Router,
    private _connectionStore: ConnectionStore,
    private _walletStore: WalletStore
  ) { }
  async ngOnInit(): Promise<void> {
    const hsClient = new HyperspaceClient(environment.HyperspaceKey);
    hsClient.getWalletStats({
      condition: {
        // timePeriod: "ONE_DAY" as TimePeriodEnum,
        searchAddress: 'CdoFMmSgkhKGKwunc7TusgsMZjxML6kpsvEmqpVYPjyP'
      },
      // orderBy: {field_name: "volume_bought_1day", sort_order: "DESC" as SortOrderEnum}
    }).then(result => console.log(result.getWalletStats.wallet_stats));

    connectionConfigProviderFactory({
      commitment: "confirmed",
    })
    this._connectionStore.setEndpoint(environment.solanaCluster) ;
    this._walletStore.setAdapters([
      new PhantomWalletAdapter(),
      new ExodusWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter(),
      new SolletExtensionWalletAdapter(),
      new SolletWalletAdapter(),
    ]);

  }
  

}
