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
    poolName: string;
    apy:number | null;
    exchangeRate: number | null;
    tokenSymbol: string | null; 
    tokenMint:PublicKey;
    tokenImageURL: string;
    poolPublicKey: PublicKey;
    MEVDelegation: boolean;
    website: string;
  }