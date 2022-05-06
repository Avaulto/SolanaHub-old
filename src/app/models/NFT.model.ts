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