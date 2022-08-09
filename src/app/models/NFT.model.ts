export interface NFTGroup {
    collectionName: string,
    collectionImage: string,
    NFTdata: NFTdata[]
  }
  
  export interface NFTdata {
    collectionName: string,
    collectionImage: string,
    name: string,
    description: string,
    image: string,
    value: number,
    mintAddr: string,
    attr: any,
    websiteURL?: string;
    explorerURL?: string;
  }

  export interface ParsedNftData{
    parsed?: {
      info?: {
        lamports?: number,
        newAccount?: string
      }
    }
  }

  export interface SolanaPriceData{
    data?: {
      price?: number
    }
    
  }

  export interface MECollectionStats{
    symbol: string,
    floorPrice: number,
    listedCount: number,
    volumeAll: number
  }
