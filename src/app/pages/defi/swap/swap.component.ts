// import { Token } from '@angular/compiler';
import { Token } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { Jupiter, RouteInfo, TOKEN_LIST_URL } from '@jup-ag/core'
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { SolanaUtilsService } from 'src/app/services/solana-utils.service';

@Component({
  selector: 'app-swap',
  templateUrl: './swap.component.html',
  styleUrls: ['./swap.component.scss'],
})
export class SwapComponent implements OnInit {

  constructor(
    private solanaUtilService: SolanaUtilsService,
    private _walletStore: WalletStore
    ) { }

  ngOnInit() {
    console.log('swap load')
    this.initJup()
    this.fetchTokenList()
  }

  public async initJup(){
  //  const connection = this.solanaUtilService.connection;
    const pk =  new PublicKey('JPQmr9p2RF3X5TuBXxn6AGcEfcsHp4ehcmzE5Ys7pZD')// this._walletStore.anchorWallet$.pipe(switchMap(wallet => wallet.publicKey))
    const jupiter = await Jupiter.load({
      connection: this.solanaUtilService.connection,
      cluster:'testnet',
      user: pk, // or public key
      // platformFeeAndAccounts:  NO_PLATFORM_FEE,
      routeCacheDuration: 10_000, // Will not refetch data on computeRoutes for up to 10 seconds
    });
    console.log(jupiter)
  }
  public async fetchTokenList(){
    const tokens: Token[] = await (await fetch(TOKEN_LIST_URL['mainnet-beta'])).json(); 
    console.log(tokens)
  }
}
