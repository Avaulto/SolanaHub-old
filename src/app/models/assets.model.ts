import { PublicKey, Transaction } from "@solana/web3.js";
export interface WalletExtended {
  balance?: number,
  publicKey: PublicKey,
  signTransaction: (transaction: Transaction) => Promise<Transaction>,
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>
}
export interface Asset {
  name: string,
  symbol?: string,
  balance: number,
  price?: number,
  icon: string,
  totalUsdValue: number,
  totalSolValue?: number,
  baseOfPortfolio?: any;
  address?: string;
  decimals?: number;
}
export interface CoinData {
  marketCap: number
  name?: string,
  symbol?: string;
  price: { btc: number, usd: number },
  price_change_percentage_24h_in_currency: { btc: number, usd: number },
  desc?: string,
  image: { thumb, small, large },
  website: string,
  contract_address?: string
  mintAddress?: string;
};