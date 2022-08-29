import { Injectable } from '@angular/core';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { SolanaUtilsService } from './solana-utils.service';

import { Nft, NFTGroup, NFTmetaData } from '../models';
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { PublicKey } from '@solana/web3.js';
import { map, Observable } from 'rxjs';

interface ListInstuction {
  sellerAddress: string,
  auctionHouseAddress: string,
  tokenMint: string,
  tokenAccount: string,
  sol: string,
  expiry: string
}
@Injectable({
  providedIn: 'root'
})
export class NftStoreService {
  protected magicEdenApiProxy = `https://dev.compact-defi.avaulto.com/api/ME-proxy`
  private _metaplex = new Metaplex(this._solanaUtilsService.connection);
  constructor(
    private _solanaUtilsService: SolanaUtilsService,
  ) { }
  public async getNftList(walletOwnerAddress: string): Promise<Nft[]> {
    const uri = `${this.magicEdenApiProxy}?env=mainnet&endpoint=wallets/${walletOwnerAddress}/tokens`
    const getNFTsReq = await fetch(uri)
    const nfts: Nft[] = await getNFTsReq.json();
    return nfts
  }
  public async getSingleNft(mintAddress): Promise<Nft> {
    const uri = `${this.magicEdenApiProxy}?env=mainnet&endpoint=tokens/${mintAddress}`;
    const getNFTsReq = await fetch(uri)
    const nft: Nft = await getNFTsReq.json();
    return nft
  }

  public async listNft({ sellerAddress, auctionHouseAddress, tokenMint, tokenAccount, sol, expiry }: ListInstuction) {
    const queryParam = encodeURIComponent(`price=${sol}&seller=${sellerAddress}&auctionHouseAddress=${auctionHouseAddress}&tokenMint=${tokenMint}&tokenAccount=${tokenAccount}&expiry=${expiry}`)
    const uri = `${this.magicEdenApiProxy}?env=mainnet&endpoint=instructions/sell&queryParam=${queryParam}`;
    console.log(uri)
    const getSellNftInstructionReq = await fetch(uri)
    const sellNftInstructionReq = await getSellNftInstructionReq.json();
    console.log(sellNftInstructionReq)
    return sellNftInstructionReq
  }
  // public async getNftz(publicAddress: string): Promise<NFTGroup[]> {
  //   const nftArray = await getParsedNftAccountsByOwner({
  //     publicAddress,
  //     connection: this._solanaUtilsService.connection
  //   });
  //   const nftMapper = {}
  //   const collections: NFTGroup[] = []

  //   await Promise.all(nftArray.map(async metaPlexItem => {
  //     try {
  //       const metaData: NFTmetaData = await this.getMetaData(metaPlexItem.data.uri);
  //       console.log(metaPlexItem)
  //       const nft: Nft = {
  //         name: metaPlexItem.data.name,
  //         image: metaData.image,
  //         description: metaData.description,
  //         mint: metaPlexItem.mint,
  //         price: 0,
  //         attr: metaData.attributes,
  //         explorerURL: 'https://solscan.io/token/' + metaPlexItem.mint,
  //         websiteURL: metaData.external_url,
  //         symbol: metaPlexItem.data.symbol
  //       }
  //       if (nftMapper[nft.symbol]) {
  //         nftMapper[nft.symbol].push(nft);
  //       } else {
  //         nftMapper[nft.symbol] = [];
  //         nftMapper[nft.symbol].push(nft);
  //       }
  //       return nft
  //     } catch (error) {
  //       console.warn(error)
  //     }
  //   }))
  //   for (const iterator in nftMapper) {
  //     const nftGroup: Nft[] = nftMapper[iterator];
  //     const collection = await this.getCollectionData(nftGroup[0].mint)
  //     collection.NFTs = nftGroup;
  //     collections.push(collection)
  //   }
  //   return collections


  // }

  // private async getMetaData(uri: string): Promise<NFTmetaData> {
  //   let metaData: NFTmetaData = {}
  //   try {
  //     metaData = await (await fetch(uri)).json();
  //     // metaDataRes = await metaDataReq.json();
  //   } catch (error) {
  //     // console.error(error)
  //     return metaData
  //   }
  //   return metaData
  // }
  public async getCollectionData(groupIdentifierMintAddress: string): Promise<NFTGroup> {
    let collectionInfo: NFTGroup = { collectionImage: null, description: null, collectionName: null, symbol: null, mint: null, floorPrice: 0 }
    const mintAddress = new PublicKey(groupIdentifierMintAddress);
    // check if the NFT is part of a collection
    const validateNftCollectionTask = this._metaplex.nfts().findByMint({ mintAddress });

    const { collection, json } = await validateNftCollectionTask.run();
    collectionInfo.description = json.description;
    if (collection) {
      const collectionDataTask = this._metaplex.nfts().findByMint({ mintAddress: collection.address });
      const { mint, json } = await collectionDataTask.run();
      collectionInfo = { collectionImage: json.image, collectionName: json.name, description: collectionInfo.description, symbol: json.symbol, mint: mint.address.toBase58() }
    }
    return collectionInfo
  }
  public async getCollectionMarketplaceData(symbol: string){
    const queryParam = encodeURIComponent('limit=1')
    const uri = `${this.magicEdenApiProxy}?env=mainnet&endpoint=/collections/${symbol}/listings&queryParam=${queryParam}`;
    const getCollectionMarketplace = await fetch(uri)
    const marketplacedata: any = await getCollectionMarketplace.json();
    return marketplacedata[0]
  }
  private getFloorPrice(nft: Nft): number {
    return 0
  }
}
