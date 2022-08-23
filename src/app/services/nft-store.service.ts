import { Injectable } from '@angular/core';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { SolanaUtilsService } from './solana-utils.service';
import { UtilsService } from './utils.service';
import {
  resolveToWalletAddress,
  getParsedNftAccountsByOwner,
  createConnectionConfig
} from "@nfteyez/sol-rayz";
import { Nft, NFTGroup, NFTmetaData } from 'src/app/models';
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { PublicKey } from '@solana/web3.js';
import { map, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NftStoreService {
  protected magicEdenApi = 'https://api-devnet.magiceden.dev/v2';
  private _metaplex = new Metaplex(this._solanaUtilsService.connection);
  constructor(
    private _solanaUtilsService: SolanaUtilsService,
    private _utilsService: UtilsService,
    private _walletStore: WalletStore
  ) { }
  public async getNftz2(publicAddress: string): Promise<NFTGroup[]> {

      const getNFTsReq = await fetch(`${this.magicEdenApi}/wallets/${publicAddress}/tokens?offset=0&listStatus=both`, {
        //  headers:{
        //    "Authorization": "Bearer 8df043d5-b766-448b-8513-d7f72e470c8b"
        //  },
        //  redirect: 'follow',
        //   mode: 'no-cors'
      })
      // const nfts = await getNFTsReq.json();
      console.log(getNFTsReq)
    return []
  }
  public async getNftz(publicAddress: string): Promise<NFTGroup[]> {
    const nftArray = await getParsedNftAccountsByOwner({
      publicAddress,
      connection: this._solanaUtilsService.connection
    });
    const nftMapper = {}
    const collections: NFTGroup[] = []

    await Promise.all(nftArray.map(async metaPlexItem => {
      try {
        const metaData: NFTmetaData = await this.getMetaData(metaPlexItem.data.uri);
        console.log(metaPlexItem)
        const nft: Nft = {
          name: metaPlexItem.data.name,
          image: metaData.image,
          description: metaData.description,
          mint: metaPlexItem.mint,
          price: 0,
          attr: metaData.attributes,
          explorerURL: 'https://solscan.io/token/' + metaPlexItem.mint,
          websiteURL: metaData.external_url,
          symbol: metaPlexItem.data.symbol
        }
        if (nftMapper[nft.symbol]) {
          nftMapper[nft.symbol].push(nft);
        } else {
          nftMapper[nft.symbol] = [];
          nftMapper[nft.symbol].push(nft);
        }
        return nft
      } catch (error) {
        console.warn(error)
      }
    }))
    for (const iterator in nftMapper) {
      const nftGroup: Nft[] = nftMapper[iterator];
      const collection = await this.getCollectionData(nftGroup[0].mint)
      collection.NFTs = nftGroup;
      collections.push(collection)
    }
    return collections


  }

  private async getMetaData(uri: string): Promise<NFTmetaData> {
    let metaData: NFTmetaData = {}
    try {
      metaData = await (await fetch(uri)).json();
      // metaDataRes = await metaDataReq.json();
    } catch (error) {
      // console.error(error)
      return metaData
    }
    return metaData
  }
  private async getCollectionData(groupIdentifierMintAddress: string): Promise<NFTGroup> {
    let collectionInfo: NFTGroup = { collectionImage: null, collectionName: null, symbol: null, mint: null, floorPrice: 0 }
    const mintAddress = new PublicKey(groupIdentifierMintAddress);
    // check if the NFT is part of a collection
    const validateNftCollectionTask = this._metaplex.nfts().findByMint({ mintAddress });
    const { collection } = await validateNftCollectionTask.run();
    if (collection) {
      const collectionDataTask = this._metaplex.nfts().findByMint({ mintAddress: collection.address });
      const { mint, json } = await collectionDataTask.run()
      collectionInfo = { collectionImage: json.image, collectionName: json.name, symbol: json.symbol, mint: mint.address.toBase58() }
    }
    return collectionInfo
  }
  private getFloorPrice(nft: Nft): number {
    return 0
  }
}
