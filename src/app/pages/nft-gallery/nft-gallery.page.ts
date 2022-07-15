import { Component, OnInit } from '@angular/core';
import { PublicKey } from "@solana/web3.js";
import {
  resolveToWalletAddress,
  getParsedNftAccountsByOwner,
} from "@nfteyez/sol-rayz";



import { ApiService } from 'src/app/services';

import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import { NFTdata, NFTGroup } from 'src/app/models';

 declare global {
  interface Window {
      keplr: any;
  }
}


@Component({
  selector: 'app-nft-gallery',
  templateUrl: './nft-gallery.page.html',
  styleUrls: ['./nft-gallery.page.scss'],
})
export class NftGalleryPage implements OnInit {
  nftCollections: NFTGroup[] = []
  constructor(private apiService: ApiService) { }

  ngOnInit() {
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

      const owner = new PublicKey("JPQmr9p2RF3X5TuBXxn6AGcEfcsHp4ehcmzE5Ys7pZD");
      // let response = await connection.getParsedTokenAccountsByOwner(owner, { programId: TOKEN_PROGRAM_ID });


      const publicAddress = await resolveToWalletAddress({
        text: 'JPQmr9p2RF3X5TuBXxn6AGcEfcsHp4ehcmzE5Ys7pZD'
      });

      const nftArray = await getParsedNftAccountsByOwner({
        publicAddress,
      });
      nftArray.forEach(item => {
        console.log(item);
        // console.log('parent:', item)
        this.apiService.get(item.data.uri).subscribe(r => {
          console.log(r)
          const nft: NFTdata = { collectionName: 'Marinade Chefs', collectionImage: 'https://mnde-nft-api.mainnet-beta.marinade.finance/collection/image', name: item.data.name, image: r.image, description: r.description, mintAddr: item.mint, value: 0, attr: r.attributes, explorerURL: 'https://solscan.io/token/'+item.mint,websiteURL: r.external_url  }
          solanaNFTs.NFTdata.push(nft)
        })
      })
      this.nftCollections.push(solanaNFTs)
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
