import { Component, OnInit } from '@angular/core';
import { ConnectionStore, Wallet, WalletStore } from '@heavy-duty/wallet-adapter';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { first, Observable, switchMap } from 'rxjs';
import { Asset, CoinData, NFTGroup,Nft, TokenBalance } from 'src/app/models';
import { ApiService, UtilsService, DataAggregatorService,SolanaUtilsService , NftStoreService} from 'src/app/services';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {
  public nfts: Observable<Nft[]> = this._walletStore.anchorWallet$.pipe(
    this.utils.isNotNull,
    switchMap(async wallet => {
     return (await this._nftStore.getAllOnwerNfts(wallet)).splice(0,3)
    }))

  public asset: Asset = {
    name: 'solana',
    tokens: [],
  }
  public walletTotalValue = {usdValue:0, solValue: 0}
  constructor(
    private utils: UtilsService,
    private _nftStore: NftStoreService,
    private apiService: ApiService,
    private dataAggregator: DataAggregatorService,
    private solanaUtilsService: SolanaUtilsService,
    private _walletStore: WalletStore,
  ) { }


  ngOnInit() {
    // this.dataAggregator.getSolWalletData('JPQmr9p2RF3X5TuBXxn6AGcEfcsHp4ehcmzE5Ys7pZD').subscribe(val =>console.log(val))
    this.dataAggregator.getCoinData(this.asset.name).subscribe(coinData => this.asset.coinData = coinData);

    this._walletStore.anchorWallet$.pipe(this.utils.isNotNull).subscribe(async wallet => {
      // fetch tokens by owner
      const tokensByOwner = await this.solanaUtilsService.getTokenAccountsBalance(wallet.publicKey.toBase58())
      // fetch token info from coingeko
      const coinDataReq = tokensByOwner.map(async token => await this.dataAggregator.getCoinDataByContract(token.mintAddress))
      // wait for all tokens
      const coinDataRes = await Promise.all(coinDataReq);
      // filter out failure promises
      const coinDataResResNoEmptyValue: CoinData[] = coinDataRes.filter(function (value) { return typeof value !== 'undefined'; })
      
      coinDataResResNoEmptyValue.forEach(coinData => {
        const findToken = tokensByOwner.find(token => token.mintAddress == coinData.mintAddress)
        const asset = this._prepAsset(coinData, findToken)
        this.asset.tokens.push(asset);
      })



        this.setWallet(wallet)
        const balanace = (await this.solanaUtilsService.connection.getBalance(wallet.publicKey)) / LAMPORTS_PER_SOL;
        this.asset.balance = this.utils.shortenNum((balanace));
        this.asset.totalUsdValue = this.utils.shortenNum(balanace * this.asset.coinData?.price?.usd)
        
        const { balance, totalUsdValue} = this.asset;
        const {small} =this.asset.coinData.image
        const solanaToken = {
          name:'sol', balance,icon:small, totalUsdValue: Number(totalUsdValue)
        }
        this.asset.tokens.push(solanaToken)

        this._evalutePortfolio();
    })

  }

  private _prepAsset(coinData: CoinData, token: TokenBalance): Asset {
    return {
      name: coinData.symbol,
      balance:  this.utils.shortenNum(token.balance),
      icon: coinData.image.small,
      totalUsdValue: token.balance * coinData.price.usd
    }
  }
  private _evalutePortfolio() {
    this.walletTotalValue.usdValue = this.asset.tokens.reduce(
      (previousValue, currentValue: Asset) => previousValue + currentValue.totalUsdValue,
      0
    );
    this.walletTotalValue.solValue = this.utils.shortenNum(this.walletTotalValue.usdValue / this.asset.coinData.price.usd);
    this.asset.tokens.map(token => {
      token.baseOfPortfolio = this.utils.shortenNum(token.totalUsdValue / this.walletTotalValue.usdValue * 100, 1)
    })

    this.asset.tokens.sort((a,b) => a.baseOfPortfolio - b.baseOfPortfolio)
  }
  private setWallet(wallet: any) {
    const walletAddrs = this.utils.addrUtil(wallet.publicKey.toBase58());
    this.asset.publicKey = wallet.publicKey;
    this.asset.address = walletAddrs.addr
    this.asset.addrShort = walletAddrs.addrShort
  }
  // private _getNfts(pk: PublicKey) {
  //   (async () => {
  //     let solanaNFTs: NFTGroup = {
  //       collectionName: 'Marinade Chefs',
  //       collectionImage: 'https://mnde-nft-api.mainnet-beta.marinade.finance/collection/image',
  //       NFTdata: []
  //     }
  //     // connection
  //     // const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

  //     const owner = new PublicKey("JPQmr9p2RF3X5TuBXxn6AGcEfcsHp4ehcmzE5Ys7pZD");
  //     // let response = await connection.getParsedTokenAccountsByOwner(owner, { programId: TOKEN_PROGRAM_ID });


  //     const publicAddress = await resolveToWalletAddress({
  //       text: 'JPQmr9p2RF3X5TuBXxn6AGcEfcsHp4ehcmzE5Ys7pZD'
  //     });

  //     const nftArray = await getParsedNftAccountsByOwner({
  //       publicAddress,
  //     });
  //     nftArray.forEach((item, index) => {
  //       if (index != 0) {

  //         // console.log('parent:', item)
  //         this.apiService.get(item.data.uri).subscribe(r => {
  //           const nft: NFTdata = { collectionName: 'Marinade Chefs', collectionImage: 'https://mnde-nft-api.mainnet-beta.marinade.finance/collection/image', name: item.data.name, image: r.image, description: r.description, mintAddr: item.mint, value: 0, attr: r.attributes, explorerURL: 'https://solscan.io/token/' + item.mint, websiteURL: r.external_url }
  //           solanaNFTs.NFTdata.push(nft)
  //         })
  //       }
  //     })
  //     // this.nftCollections.push(solanaNFTs)
  //   })();
  // }
}
