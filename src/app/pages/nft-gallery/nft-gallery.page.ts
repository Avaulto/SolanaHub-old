import { Component, OnInit } from '@angular/core';
import { PublicKey } from "@solana/web3.js";
import {
  resolveToWalletAddress,
  getParsedNftAccountsByOwner,
} from "@nfteyez/sol-rayz";

import { SecretNetworkClient, Wallet } from "secretjs";


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

  async askSecretNft() {
    const permitName = "secretswap.io";
    const allowedTokens = ["secret18vd8fpwxzck93qlwghaj6arh4p7c5n8978vsyg"];
    const permissions = ["balance" /* , "history", "allowance" */];

    const wallet = new Wallet(
      "grant rice replace explain federal release fix clever romance raise often wild taxi quarter soccer fiber love must tape steak together observe swap guitar",
    );
    const myAddress = wallet.address;
    const chainId = "pulsar-2";
    // To create a signer secret.js client, also pass in a wallet
    const secretjs = await SecretNetworkClient.create({
      grpcWebUrl: "http://rpc.pulsar.griptapejs.com:9091",
      chainId,
      wallet,
      walletAddress: myAddress,
    });
    console.log(secretjs)
    const { signature } = await window.keplr.signAmino(
      chainId,
      myAddress,
      {
        chain_id: chainId,
        account_number: "0", // Must be 0
        sequence: "0", // Must be 0
        fee: {
          amount: [{ denom: "uscrt", amount: "0" }], // Must be 0 uscrt
          gas: "1", // Must be 1
        },
        msgs: [
          {
            type: "query_permit", // Must be "query_permit"
            value: {
              permit_name: permitName,
              allowed_tokens: allowedTokens,
              permissions: [""],
            },
          },
        ],
        memo: "", // Must be empty
      },
      {
        preferNoSetFee: true, // Fee must be 0, so hide it from the user
        preferNoSetMemo: true, // Memo must be empty, so hide it from the user
      }
    );

    // const { balance } = await secretjs.queryContractSmart(
    //   "secret18vd8fpwxzck93qlwghaj6arh4p7c5n8978vsyg",
    //   {
    //     with_permit: {
    //       query: { balance: {} },
    //       permit: {
    //         params: {
    //           permit_name: permitName,
    //           allowed_tokens: allowedTokens,
    //           chain_id: chainId,
    //           permissions: permissions,
    //         },
    //         signature: signature,
    //       },
    //     },
    //   }
    // );

    // console.log(balance.amount);
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
