export interface NFTGroup {
  collectionName?: string,
  collectionImage?: string,
  description: string;
  mint: string;
  symbol: string;
  floorPrice?: number,
}

export interface Nft {
  mintAddress: string,
  owner: string,
  supply: number,
  collection: string,
  collectionName: string,
  name: string,
  updateAuthority: string,
  primarySaleHappened: boolean,
  sellerFeeBasisPoints: number,
  image: string,
  externalUrl: string,
  attributes: [
    {
      trait_type: string,
      value: number
    },
    
  ],
  properties?: any,
  listStatus: string
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