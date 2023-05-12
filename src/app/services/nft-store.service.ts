import { Injectable } from '@angular/core';

import { SolanaUtilsService } from './solana-utils.service';

import { collectionStats, ListInstuction, Nft, NFTGroup } from '../models';
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class NftStoreService {
  protected magicEdenApiProxy = environment.serverlessAPI + '/api/ME-proxy?env=mainnet';
  protected metaplexApiProxy = environment.serverlessAPI + '/api/MP-proxy';
  private _metaplex = new Metaplex(this._solanaUtilsService.connection);
  // private myNfts: Subject<Nft[]> = new Subject();
  // public myNft$ = this.myNfts.asObservable();
  constructor(

    private _solanaUtilsService: SolanaUtilsService,
  ) {

  }
  public async createNft(name: string) {
    const wallet = this._solanaUtilsService.getCurrentWallet()
    this._metaplex.use(walletAdapterIdentity(wallet));
    try {
      const  {nft}  = await this._metaplex
        .nfts()
        .create({
          isCollection: true,
          uri: "https://yyuf64d3dxl7pzwpyvwb24vqgztrxci5w3rvubbogt5s2d2m3weq.arweave.net/xihfcHsd1_fmz8VsHXKwNmcbiR2241oELjT7LQ9M3Yk",
          name,
          sellerFeeBasisPoints: 0, // Represents 5.00%.
          ruleSet:null
        })
        // this._metaplex.nfts().lock({nftOrSft:'', authority})
        // await this._metaplex.nfts().delegate({})
        // await this._metaplex.nfts().freezeDelegatedNft({mintAddress: nft.address, delegateAuthority: ? })
      return nft;
    } catch (error) {
      console.log(error)
    }
  }
  public async getMagicEdenOwnerNFTS(walletOwnerAddress: string): Promise<any[]> {
    const uri = `${this.magicEdenApiProxy}&endpoint=wallets/${walletOwnerAddress}/tokens`
    const getNFTsReq = await fetch(uri)
    const nfts: Nft[] = await getNFTsReq.json();
    return nfts
  }

  public async lockNft(addr) {

    try {

    } catch (error) {

    }
  }
  public async nftSellOrCancel(type: 'sell' | 'sell_cancel', { sellerAddress, auctionHouseAddress, tokenMint, tokenAccount, sol, expiry }: ListInstuction): Promise<{ tx: any, txSigned: any }> {

    let sellCancelNftInstructionReq: { tx: any, txSigned: any } = null;
    try {
      const queryParam = encodeURIComponent(`price=${sol}&seller=${sellerAddress}&auctionHouseAddress=${auctionHouseAddress}&tokenMint=${tokenMint}&tokenAccount=${tokenAccount}&expiry=${expiry}`)
      const uri = `${this.magicEdenApiProxy}&endpoint=instructions/${type}&queryParam=${queryParam}`;
      const getSellCancelNftInstructionReq = await fetch(uri)
      sellCancelNftInstructionReq = await getSellCancelNftInstructionReq.json();
    } catch (error) {
      console.warn(error)
    }
    return sellCancelNftInstructionReq
  }


  public async listStatus(mintAddress: string): Promise<any> {
    let listStatus = ''
    try {
      const uri = `${this.magicEdenApiProxy}&endpoint=tokens/${mintAddress}/listings`
      const getListreq = await fetch(uri)
      listStatus = await getListreq.json();
    } catch (error) {
      console.warn(error)
    }

    return listStatus
  }

  private async _getFloorPrice(collectionName: string): Promise<number> {
    let floorPrice = 0;
    if (collectionName) {
      try {
        const uri = `${this.magicEdenApiProxy}&endpoint=collections/${collectionName.toLowerCase()}/stats`
        const getNFTsReq = await fetch(uri)
        const collectionStats: collectionStats = await getNFTsReq.json();
        floorPrice = collectionStats.floorPrice / LAMPORTS_PER_SOL
      } catch (error) {
        console.warn(error)
      }
    }
    return floorPrice
  }

  public async getAllOnwerNfts(walletOwnerAddress): Promise<Nft[]> {
    let extendedNfts: Nft[] = [] as Nft[]
    // debugger
    try {

      const uri = `${this.metaplexApiProxy}?env=${environment.solanaEnv}&walletAdress=${walletOwnerAddress}`
      const getNFTsReq = await fetch(uri)
      const metaPlexNfts: Nft[] = await getNFTsReq.json();

      const magicEdenNfts: Nft[] = await this.getMagicEdenOwnerNFTS(walletOwnerAddress);


      // merge both data source

      const allSourcesNfts = (...lists): Nft[] =>
        Object.values(
          lists.reduce(
            (idx, list) => {
              list.forEach((record) => {
                if (idx[record.mintAddress])
                  idx[record.mintAddress] = Object.assign(idx[record.mintAddress], record)
                else
                  idx[record.mintAddress] = record
              })
              return idx
            },
            {}
          )
        )
      let allNft: Nft[] = await Promise.all(allSourcesNfts(metaPlexNfts, magicEdenNfts).map(async nft => {
        nft.floorPrice = await this._getFloorPrice(nft.collection);
        return nft;
      }
      ))
      extendedNfts = allNft
      return extendedNfts
    } catch (error) {
      console.warn(error)
    }
    return extendedNfts

  }

}
