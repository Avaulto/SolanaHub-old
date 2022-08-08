import { Component, OnInit } from '@angular/core';
import { WalletConfig, WalletStore, Wallet } from '@heavy-duty/wallet-adapter';
import {
  resolveToWalletAddress,
  getParsedNftAccountsByOwner,
} from "@nfteyez/sol-rayz";

import { ApiService, UtilsService } from 'src/app/services';

import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { NFTdata, NFTGroup, Asset} from 'src/app/models';
import { AssetsBalanceComponent } from 'src/app/shared/components';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { NftPriceService } from 'src/app/services/nft-price.service';
import { DATABASE_PROVIDER_NAME } from '@angular/fire/database/database';

 declare global {
  interface Window {
      keplr: any;
  }
}

/*
const httpOptions = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin': '*'
  })
};
*/



@Component({
  selector: 'app-nft-gallery',
  templateUrl: './nft-gallery.page.html',
  styleUrls: ['./nft-gallery.page.scss'],
})
export class NftGalleryPage implements OnInit {
  nftCollections: NFTGroup[] = []

  readonly isReady$ = this._walletStore.connected$

  public requestData: any;
  public publicKey: PublicKey = null;
  public priceSum: number;
  public wallet: Asset ={
    name: 'solana',
    addr: '',
    addrShort: '',
    balance: 0,
    baseOfPortfolio: '50%',
    icon:'/assets/images/Secret.png'
  }
  
  constructor(
    private apiService: ApiService,
    private _walletStore: WalletStore,
    private http: HttpClient,
    private utils: UtilsService,
    private _nftPriceService: NftPriceService
    ) { }

  ngOnInit() {
    //get/set wallet:
    this._walletStore.anchorWallet$.subscribe(async wallet => {
      if (wallet) {
        this.wallet.publicKey = wallet.publicKey;
      } 
    })



    console.log('gallery loaded');
    
    
    
    // this.askSecretNft();
    (async () => {
      let solanaNFTs: NFTGroup = {
        collectionName: 'solana',
        collectionImage: 'https://mnde-nft-api.mainnet-beta.marinade.finance/collection/image',
        NFTdata: []
        
      }
      // connection
      // const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

      //const owner = new PublicKey("JPQmr9p2RF3X5TuBXxn6AGcEfcsHp4ehcmzE5Ys7pZD");
      // let response = await connection.getParsedTokenAccountsByOwner(owner, { programId: TOKEN_PROGRAM_ID });

      /*
      const publicAddress = await resolveToWalletAddress({
        text: this.wallet.publicKey.toString()
      });
      */

      const nftArray = await getParsedNftAccountsByOwner({
        publicAddress: this.wallet.publicKey?.toString(),
      });

      let priceArray=[]

      for (let item of nftArray){

        let nftValue=await this._nftPriceService.getLastPurchasePrice(item.mint)
        priceArray.push(nftValue)

        this.apiService.get(item.data.uri).subscribe(r => {

            const nft: NFTdata = { collectionName: 'Solana NFTs', collectionImage: 'https://mnde-nft-api.mainnet-beta.marinade.finance/collection/image', name: item.data.name, image: r.image, description: r.description, mintAddr: item.mint, value: nftValue, attr: r.attributes, explorerURL: 'https://solscan.io/token/'+item.mint,websiteURL: r.external_url  }
            console.log(nft)
            solanaNFTs.NFTdata.push(nft)

        })
      }
      /*
      nftArray.forEach(item => {
        console.log(item);
        // console.log('parent:', item)
        

        this.apiService.get(item.data.uri).subscribe(r => {
          //console.log(r)

          this._nftPriceService.getLastPurchasePrice(item.mint).then(nftPrice=>{

            const nft: NFTdata = { collectionName: 'Marinade Chefs', collectionImage: 'https://mnde-nft-api.mainnet-beta.marinade.finance/collection/image', name: item.data.name, image: r.image, description: r.description, mintAddr: item.mint, value: nftPrice, attr: r.attributes, explorerURL: 'https://solscan.io/token/'+item.mint,websiteURL: r.external_url  }
            console.log(nft)
            solanaNFTs.NFTdata.push(nft)

          })
          
        })
      })
      */
      this.nftCollections.push(solanaNFTs)
      console.log(solanaNFTs.NFTdata)
      console.log(solanaNFTs.NFTdata.map(x=>x.name))
      
      this.priceSum = priceArray.reduce((a, b) => a + b, 0).toFixed(2)
      console.log(this.priceSum)
      
    })();


    // this.getAssosiateAccounts();
  }
  setSort(ev) {

  }

 
  getAssosiateAccounts() {

    (async () => {
      const MY_WALLET_ADDRESS = "JPQmr9p2RF3X5TuBXxn6AGcEfcsHp4ehcmzE5Ys7pZD";
      const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

      const accounts = await connection.getParsedProgramAccounts(
        TOKEN_PROGRAM_ID, // new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
        {
          filters: [
            {
              dataSize: 165, // number of bytes
            },
            {
              memcmp: {
                offset: 32, // number of bytes
                bytes: MY_WALLET_ADDRESS, // base58 encoded string
              },
            },
          ],
        }
      );

      console.log(
        `Found ${accounts.length} token account(s) for wallet ${MY_WALLET_ADDRESS}: `
      );
      accounts.forEach((account, i) => {
        console.log(
          `-- Token Account Address ${i + 1}: ${account.pubkey.toString()} --`
        );
        console.log(account.account.data);
        // console.log(
        //   `Amount: ${account.account.data["parsed"]["info"]["tokenAmount"]["uiAmount"]}`
        // );
      });
      /*
        // Output
    
        Found 1 token account(s) for wallet FriELggez2Dy3phZeHHAdpcoEXkKQVkv6tx3zDtCVP8T: 
        -- Token Account Address 1: Et3bNDxe2wP1yE5ao6mMvUByQUHg8nZTndpJNvfKLdCb --
        Mint: BUGuuhPsHpk8YZrL2GctsCtXGneL1gmT5zYb7eMHZDWf
        Amount: 3
      */
    })();
  }
}
