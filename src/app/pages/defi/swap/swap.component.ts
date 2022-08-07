// import { Token } from '@angular/compiler';
import { Token } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { Jupiter, RouteInfo, TOKEN_LIST_URL } from '@jup-ag/core'
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { BehaviorSubject, Subject } from 'rxjs';
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
    // console.log(jupiter)
  }
  public tokensList = new BehaviorSubject([] as []);
  public currentTokenList = this.tokensList.asObservable()
  public async fetchTokenList(){
    const tokens = await (await fetch(TOKEN_LIST_URL['mainnet-beta'])).json(); 
    const tokensListPrep = this.prepTokenList(tokens);
    console.log(tokensListPrep)
    this.tokensList.next(tokensListPrep);
    // const filterSolToken = tokens.filter(token => token.address == "So11111111111111111111111111111111111111111")[0];
    // this.swapPair.pairOne = this.prepTokenData(filterSolToken);

    // console.log(this.swapPair)
  }
  private prepTokenList(tokens){
    return tokens.map(token =>{
      return this.prepTokenData(token)
    })
  }
  private prepTokenData(token){
    const { name, address, logoURI, symbol} = token
    return {name,address,selectable:true, symbol, image: logoURI, extraData: {symbol}}
  }
  public swapPair = {
    pairOne: {},
    pairTwo: {}
  }
  public showCoinsListOne: boolean = false;
  public showCoinsListTwo: boolean = false;
  setSelectedFirstPair(pair) {
      console.log(pair)
    this.swapPair.pairOne = pair;
    this.showCoinsListOne = !this.showCoinsListOne

  }
  setSelectedSecondPair(pair) {
    
    this.swapPair.pairTwo = pair;
    this.showCoinsListTwo = !this.showCoinsListTwo

  }
  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
  }
}
