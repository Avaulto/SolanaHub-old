import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConnectionStore, Wallet, WalletStore } from '@heavy-duty/wallet-adapter';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { filter, first, firstValueFrom, map, mergeMap, Observable, of, shareReplay, Subject, switchMap, tap } from 'rxjs';
import { Asset, CoinData, NFTGroup, Nft, TokenBalance } from 'src/app/models';
import { ApiService, UtilsService, DataAggregatorService, SolanaUtilsService, NftStoreService, LoaderService } from 'src/app/services';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit, OnDestroy {
  public walletExtended: Observable<Asset> = this._walletStore.anchorWallet$.pipe(
    this._utilsService.isNotNull,
    shareReplay(1),
    mergeMap(async wallet => {
      if (wallet) {
        let asset: Asset = {
          name: 'solana',
          tokens: [],
          nfts: []
        };
        // get solPrice
        asset.coinData = await firstValueFrom(this._dataAggregator.getCoinData(asset.name));
        asset.tokens = await this._getTokens(wallet.publicKey);
        asset.nfts = (await this._nftStore.getAllOnwerNfts(wallet.publicKey.toBase58())).splice(0, 3)


        // assign wallet logged
        asset = await this._setWallet(wallet, asset)

        // calc usd & sol value
        asset = this._evalutePortfolio(asset);
        return asset;
      } else {
        return null
      }
    },
    ), shareReplay(1))

  public walletTotalValue = { usdValue: 0, solValue: 0 }
  readonly isReady$ = this._walletStore.connected$;
  constructor(
    private _utilsService: UtilsService,
    private _nftStore: NftStoreService,
    private _dataAggregator: DataAggregatorService,
    private _solanaUtilsService: SolanaUtilsService,
    private _walletStore: WalletStore,


  ) { }

  public ngOnInit() {
    this.isReady$.subscribe(val => {
      if (!val) {
        // this.walletExtended = null;
      }
    })
  }


  private async _getTokens(publicKey: PublicKey): Promise<Asset[]> {
    const tokens = [];
    // fetch tokens by owner
    const tokensByOwner = await this._solanaUtilsService.getTokenAccountsBalance(publicKey.toBase58())
    // fetch token info from coingeko
    const coinDataReq = tokensByOwner.map(async token => await this._dataAggregator.getCoinDataByContract(token.mintAddress))
    // wait for all tokens
    const coinDataRes = await Promise.all(coinDataReq);
    // filter out failure promises
    const coinDataResResNoEmptyValue: CoinData[] = coinDataRes.filter(function (value) { return typeof value !== 'undefined'; })

    // prep asset props
    coinDataResResNoEmptyValue.forEach(coinData => {
      const findToken = tokensByOwner.find(token => token.mintAddress == coinData.mintAddress)
      const token = this._prepAsset(coinData, findToken)
      tokens.push(token);
    })
    return tokens;
  }
  private _prepAsset(coinData: CoinData, token: TokenBalance): Asset {
    return {
      name: coinData.symbol,
      balance: this._utilsService.shortenNum(token.balance),
      icon: coinData.image.small,
      totalUsdValue: token.balance * coinData.price.usd
    }
  }
  private _evalutePortfolio(asset: Asset): Asset {
    this.walletTotalValue.usdValue = asset.tokens.reduce(
      (previousValue, currentValue: Asset) => previousValue + currentValue.totalUsdValue,
      0
    );
    this.walletTotalValue.solValue = this._utilsService.shortenNum(this.walletTotalValue.usdValue / asset.coinData.price.usd);
    asset.tokens.map(token => {
      token.baseOfPortfolio = this._utilsService.shortenNum(token.totalUsdValue / this.walletTotalValue.usdValue * 100, 1)
    })
    asset.tokens = asset.tokens.sort((a, b) => a.baseOfPortfolio - b.baseOfPortfolio);
    return asset;
  }
  private async _setWallet(wallet: any, asset: Asset): Promise<Asset> {
    const walletAddrs = this._utilsService.addrUtil(wallet.publicKey.toBase58());
    asset.publicKey = wallet.publicKey;
    asset.address = walletAddrs.addr
    asset.addrShort = walletAddrs.addrShort
    const balanace = (await this._solanaUtilsService.connection.getBalance(wallet.publicKey)) / LAMPORTS_PER_SOL;
    asset.balance = this._utilsService.shortenNum((balanace));
    asset.totalUsdValue = this._utilsService.shortenNum(balanace * asset.coinData?.price?.usd)

    const { balance, totalUsdValue } = asset;
    const { small } = asset.coinData.image
    const solanaToken = {
      name: 'sol', balance, icon: small, totalUsdValue: Number(totalUsdValue)
    }
    asset.tokens.push(solanaToken);
    return asset
  }

  public ngOnDestroy(): void {
    // this.walletExtended.unsubscribe()
  }

}

