import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PopoverController } from '@ionic/angular';
import { LAMPORTS_PER_SOL, PublicKey, Transaction } from '@solana/web3.js';
import { combineLatestWith, distinctUntilChanged, firstValueFrom, Observable, shareReplay, switchMap } from 'rxjs';
import { Asset, Nft, TokenBalance, Token } from 'src/app/models';
import { ApiService, UtilsService, SolanaUtilsService, NftStoreService } from 'src/app/services';
import { JupiterStoreService } from 'src/app/services/jupiter-store.service';
import { ConvertBalancePopupComponent } from './convert-balance-popup/convert-balance-popup.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, OnDestroy {
  private _assets: Asset[] = []
  private wallet: {
    publicKey: PublicKey;
    signTransaction: (transaction: Transaction) => Promise<Transaction>;
    signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
  };

  public walletExtended$: Observable<any> = this._solanaUtilsService.walletExtended$.pipe(
    // accountStateChange used as trigger for re-render wallet related context
    switchMap(async (wallet) => {
      this._assets = []
      if (wallet) {
        this.wallet = wallet;
        const solData = await this._jupStore.fetchPriceFeed('SOL');
        const totalUsdValue = wallet.balance * solData.data['SOL'].price
        let asset: Asset = {
          name: 'SOL',
          balance: wallet.balance,
          icon: 'assets/images/icons/solana-logo.webp',
          totalUsdValue,
          totalSolValue:  wallet.balance,
          price: solData.data['SOL'].price
        }
        this._assets.push(asset)
        // this.initWalletEval(asset, wallet)
        const walletExtended = { ...wallet, asset, addressUtil: this.utilsService.addrUtil(wallet.publicKey.toBase58()) }
        return walletExtended;
      } else {

        return null
      }

    }), shareReplay(),
  )
  public assets: Observable<Asset[]> = this._jupStore.fetchTokenList().pipe(
    combineLatestWith([this.walletExtended$]),
    distinctUntilChanged(),
    switchMap(async ([jupTokens, wallet]: any) => {
      if (wallet) {

        this._assets = await this._prepTokenList(jupTokens, wallet.publicKey)
        const assets = this._evalutePortfolio();

        return assets;
      } else {
        return null
      }
    }), shareReplay())
  public myNfts: Observable<Nft[]> = this._solanaUtilsService.walletExtended$.pipe(
    switchMap(async wallet => {
      if (wallet) {
        return (await this._nftStore.getAllOnwerNfts(wallet.publicKey.toBase58())).splice(0, 3)
      } else {
        return null
      }
    })
  )
  public walletTotalValue = { usdValue: 0, solValue: 0 }
  constructor(
    public utilsService: UtilsService,
    private _nftStore: NftStoreService,
    private _jupStore: JupiterStoreService,
    private _solanaUtilsService: SolanaUtilsService,
    private _popoverController: PopoverController,
    private _titleService: Title,  
  ) { 
  }
  ionViewWillEnter(){
    this._titleService.setTitle('SolanaHub - dashboard')
  }
  async openSwapSmallBalancePopup() {
    const popover = await this._popoverController.create({
      component: ConvertBalancePopupComponent,
      componentProps: { asset: this._assets[0], assets: this._assets, wallet: this.wallet },
      // event: e,
      alignment: 'start',
      // showBackdrop:false,
      backdropDismiss: true,
      // dismissOnSelect: true,
      cssClass: 'merge-accounts-popup',
    });
    await popover.present();

  }
  public ngOnInit() {

  }

  private async _prepTokenList(tokens: Token[], publicKey: PublicKey): Promise<Asset[]> {
    let assets: Asset[] = this._assets;
    // fetch tokens by owner
    const tokensByOwner = await this._solanaUtilsService.getTokenAccountsBalance(publicKey.toBase58(), 'token')
    // concat all mint address for jupiter price feed
    const mintAddress = tokensByOwner.reduce(
      (previousValue, currentValue) => previousValue + currentValue.mintAddress + ",",
      ''
    );
    // get token prices & image
    const tokensPrices = await this._jupStore.fetchPriceFeed(mintAddress);
    const getTokensList = await firstValueFrom(this._jupStore.fetchTokenList());
    const attachTokenImage = getTokensList.map(token => {
      if (tokensPrices.data[token.address]) {
        return { ...tokensPrices.data[token.address], logo: token.logoURI, decimals: token.decimals }
      }
    }).filter(data => data)


    // prep asset props
    attachTokenImage.forEach(coinData => {
      const findToken = tokensByOwner.find(token => token.mintAddress == coinData.id)
      const token = this._prepAsset(coinData, findToken)
      assets.push(token);
    })

    return assets;
  }
  private _prepAsset(coinData: any, token: TokenBalance): Asset {
    const totalUsdValue = token.balance * coinData.price;
    return {
      name: coinData.mintSymbol,
      balance: token.balance,
      icon: coinData.logo,
      totalUsdValue,
      totalSolValue: totalUsdValue / this._assets[0].price,
      price: coinData.price,
      decimals: coinData.decimals,
      address: token.mintAddress
    }
  }
  private _evalutePortfolio(): Asset[] {
    this.walletTotalValue.usdValue = this._assets.reduce(
      (previousValue, currentValue: Asset) => previousValue + currentValue.totalUsdValue,
      0
    );
    this.walletTotalValue.solValue = this.walletTotalValue.usdValue / this._assets[0].price;
    this._assets.map(token => {
      token.baseOfPortfolio = token.totalUsdValue / this.walletTotalValue.usdValue * 100, 1
    })
    this._assets = this._assets.sort((a, b) => b.totalUsdValue - a.totalUsdValue);
    return this._assets;
  }


  public ngOnDestroy(): void {
    // this.walletExtended.unsubscribe()
  }
  public openME(): void{
    window.open('https://magiceden.io/','_blank')
  }
}

