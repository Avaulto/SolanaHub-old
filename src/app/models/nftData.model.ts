export interface NFTGroup {
  collectionName?: string,
  collectionImage?: string,
  description: string;
  mint: string;
  symbol: string;
  floorPrice?: number,
}

export interface Nft {
  collection?: string,
  collectionName?:string,
  mintAddress: string,
  description: string,
  name: string,
  image: string,
  listStatus?:string;
  websiteURL: string,
  explorerURL: string,
  floorPrice?: number,
  attributes: [
    {
      trait_type: string,
      value: string
    },
    
  ],
  symbol: string
}


export interface collectionStats {
  symbol: string,
  floorPrice: number,
  listedCount: number,
  volumeAll: number
}
export interface ListInstuction {
  sellerAddress: string,
  auctionHouseAddress: string,
  tokenMint: string,
  tokenAccount: string,
  sol: string,
  expiry: string
}