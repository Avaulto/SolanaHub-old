export interface NFTGroup {
  collectionName?: string,
  collectionImage?: string,
  description: string;
  mint: string;
  symbol: string;
  floorPrice?: number,
}

export interface Nft {
  collectionName?:string,
  mintAddress: string,
  description: string,
  name: string,
  image: string,
  listStatus?:string;
  websiteURL: string,
  explorerURL: string,
  attributes: [
    {
      trait_type: string,
      value: string
    },
    
  ],
  symbol: string
}
