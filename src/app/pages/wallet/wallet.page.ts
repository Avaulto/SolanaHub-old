import { Component, OnInit } from '@angular/core';
import { getParsedNftAccountsByOwner, resolveToWalletAddress } from '@nfteyez/sol-rayz';
import { PublicKey } from '@solana/web3.js';
import { Asset, NFTdata, NFTGroup } from 'src/app/models';
import { ApiService, UtilsService } from 'src/app/services';
import { DataAggregatorService } from 'src/app/services/data-aggregator.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {
  nftCollections: NFTGroup[] = []
  deleteWallet: boolean = false;
  segmentUtilTab: string = 'stake'
  public wallet: Asset ={
    name: 'secret',
    addr:'secret10hq2llxe3lecmaxpqfpnvf942xxdgpkuwnjd0t',
    addrShort:this.utils.addrShorthand('secret10hq2llxe3lecmaxpqfpnvf942xxdgpkuwnjd0t').addrShort,
    balance: 8.00,
    baseOfPortfolio: '50%',
    icon:'/assets/images/Secret.png',
    coinData: {},
    // todo - GET owner tokens from the blockchain
    tokens: [{
      name: 'secret',
      addrShort:this.utils.addrShorthand('secret10hq2llxe3lecmaxpqfpnvf942xxdgpkuwnjd0t').addrShort,
      addr: 'secret10hq2llxe3lecmaxpqfpnvf942xxdgpkuwnjd0t',
      balance: 8.12687,
      baseOfPortfolio: '50%',
      icon:'/assets/images/Secret.png'
    },
    {
      name: 'atom',
      addrShort:this.utils.addrShorthand('cosmos10hq2llxe3lecmaxpqfpnvf942xxdgpkuvkxyjh').addrShort,
      addr: 'cosmos10hq2llxe3lecmaxpqfpnvf942xxdgpkuvkxyjh',
      balance: 5.25464,
      baseOfPortfolio: '30%',
      icon:'/assets/images/atom.webp'
    },
    {
      name: 'juno',
      addrShort: this.utils.addrShorthand('juno10hq2llxe3lecmaxpqfpnvf942xxdgpku6y9l4t').addrShort,
      addr: 'juno10hq2llxe3lecmaxpqfpnvf942xxdgpku6y9l4t',
      balance: 2.59097,
      baseOfPortfolio: '20%',
      icon:'/assets/images/juno.webp'
    }]
  }
  constructor(private utils: UtilsService,private apiService:ApiService ,private dataAggregator:DataAggregatorService) { }

  setUtil(util: string){
    this.segmentUtilTab = util;
  }
  ngOnInit() {
    this.dataAggregator.getCoinData(this.wallet.name).subscribe(coinData => this.wallet.coinData = coinData);
    this._getNfts();
  }

  public showDeleteUI(show: boolean): void{
    this.deleteWallet = show;
  }
  private _getNfts(){
    (async () => {
      let solanaNFTs: NFTGroup = {
        collectionName: 'solana',
        collectionImage: 'https://mnde-nft-api.mainnet-beta.marinade.finance/collection/image',
        NFTdata: []
      }
      // connection
      // const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

      const owner = new PublicKey("JPQmr9p2RF3X5TuBXxn6AGcEfcsHp4ehcmzE5Ys7pZD");
      // let response = await connection.getParsedTokenAccountsByOwner(owner, { programId: TOKEN_PROGRAM_ID });


      const publicAddress = await resolveToWalletAddress({
        text: 'JPQmr9p2RF3X5TuBXxn6AGcEfcsHp4ehcmzE5Ys7pZD'
      });

      const nftArray = await getParsedNftAccountsByOwner({
        publicAddress,
      });
      nftArray.forEach(item => {

        // console.log('parent:', item)
        this.apiService.get(item.data.uri).subscribe(r => {
          const nft: NFTdata = { collectionName: 'Marinade Chefs', collectionImage: 'https://mnde-nft-api.mainnet-beta.marinade.finance/collection/image', name: item.data.name, image: r.image, description: r.description, mintAddr: item.mint, value: 0, attr: r.attributes, explorerURL: 'https://solscan.io/token/'+item.mint,websiteURL: r.external_url  }
          solanaNFTs.NFTdata.push(nft)
        })
      })
      this.nftCollections.push(solanaNFTs)
      console.log(this.nftCollections)
    })();
  }
}
