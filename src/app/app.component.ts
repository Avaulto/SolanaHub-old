import { Component } from '@angular/core';
import { connectionConfigProviderFactory, ConnectionStore, WalletStore } from '@heavy-duty/wallet-adapter';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  UnsafeBurnerWalletAdapter
} from '@solana/wallet-adapter-wallets';
import { environment } from 'src/environments/environment.prod';
import { Router } from '@angular/router';
import { distinctUntilChanged, firstValueFrom } from 'rxjs';
import { DataAggregatorService, SolanaUtilsService, UtilsService } from './services';

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
    private _solanaUtilsService: SolanaUtilsService,
    private _dataAggregatorService:DataAggregatorService
  ) { }
  async ngOnInit(): Promise<void> {

    this._getSOLprice();
    this._walletStore.anchorWallet$.pipe(
      this._utilsService.isNotNull,
      this._utilsService.isNotUndefined,
      distinctUntilChanged(),
    ).subscribe(wallet => {
      this._solanaUtilsService.onAccountChangeCB(wallet.publicKey)
    })
    // connectionConfigProviderFactory({
    //   commitment: "confirmed"
    // })


      this._connectionStore.setEndpoint(environment.solanaCluster)
    const wallets = [new UnsafeBurnerWalletAdapter()]
    console.log(wallets);
    
    this._walletStore.setAdapters([
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new UnsafeBurnerWalletAdapter(),
    ]);

  }
  private async _getSOLprice(): Promise<void> {
    const coindata = await firstValueFrom(this._dataAggregatorService.getCoinData('solana'))
    this._solanaUtilsService.setSolPrice(coindata.price.usd)
  }

}
