export interface NFTGroup {
  collectionName?: string,
  collectionImage?: string,
  mint: string;
  symbol: string;
  floorPrice?: number,
  NFTs?: Nft[]
}

export interface Nft {
  name: string,
  description: string,
  image: string,
  price?: number,
  mint: string,
  attr: any,
  websiteURL?: string;
  explorerURL?: string;
  symbol: string;
}

export interface NFTmetaData {
  name?: string,
  symbol?: string,
  description?: string,
  seller_fee_basis_points?: number,
  image?: string,
  external_url?: string,
  attributes?: [
    {
      trait_type: string,
      value: string
    },

  ],
  properties?
}