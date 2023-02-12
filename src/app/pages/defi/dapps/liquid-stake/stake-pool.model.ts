import { PublicKey } from "@solana/web3.js";

export interface StakePoolStats {
    assetRatio: number;
    apy: number;
    supply: any;
    TVL: {staked_usd: number, staked_sol: number};
    validators: number;
    userHoldings?: {staked_usd: number, staked_asset: number};
    ticker?: 'mSOL' | 'bSOL'
  }

  export interface StakePoolProvider {
    name: string;
    image: string;
    poolpubkey?: PublicKey;
    mintAddress: string;
    ticker: 'mSOL' | 'bSOL'
  }