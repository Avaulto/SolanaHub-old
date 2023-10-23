export interface Stats {
    totalBorrowsUSD: number
    totalDepositsUSD: number
    solendTVL: number
    totalMarkets?: number
    totalObligations?: number
    uniqueAssets?: number
    totalFeesUSD?: string
  }
  

  export interface Market {
    name: string
    isPrimary: boolean
    description: string
    creator: string
    address: string
    hidden: boolean
    isPermissionless: boolean
    authorityAddress: string
    owner: string
    reserves: Reserve[]
    lookupTableAddress: string
  }
  
  export interface Reserve {
    liquidityToken: LiquidityToken
    pythOracle: string
    switchboardOracle: string
    address: string
    collateralMintAddress: string
    collateralSupplyAddress: string
    liquidityAddress: string
    liquidityFeeReceiverAddress: string
    userBorrowCap?: string
    userSupplyCap?: string
  }
  
  export interface LiquidityToken {
    coingeckoID: string
    decimals: number
    logo: string
    mint: string
    name: string
    symbol: string
    volume24h: string
  }
  