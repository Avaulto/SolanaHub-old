import { PublicKey } from "@solana/web3.js";

export interface StakePoolStats {
    assetRatio: number;
    apy: number;
    supply: any;
    TVL: {staked_usd: number, staked_sol: number};
    validators: number;
    userHoldings?: {staked_usd: number, staked_asset: number};
    ticker?: string
  }

  export interface StakePoolProvider {
    poolName: string;
    apy: any;
    exchangeRate: number;
    tokenSymbol: string;
    tokenMint: PublicKey;
    tokenImageURL: string;
    poolPublicKey: PublicKey;
    MEVDelegation: boolean;
    website: string;
    tokenMintSupply?: number;
    commission?: number;
    solDepositFee?: number;
    solWithdrawalFee?: number;
    totalStakedSol?: number;
    reserveSol?: number;
  }