import { PublicKey } from "@solana/web3.js";

export interface Asset {
    name:string;
    publicKey?: PublicKey
    address?: string;
    addrShort?: string;
    mintAddress?: string;
    balance?: number;
    totalUsdValue?: number;
    baseOfPortfolio?:number;
    icon?: string;
    coinData?: CoinData | any;
    tokens?: Asset[]
  }

  export interface CoinData {
    name?: string,
    symbol?: string;
    price: {btc: number, usd:number},
    price_change_percentage_24h_in_currency: {btc: number,usd:number},
    desc?: string,
    image: {thumb,small, large},
    website: string,
    contract_address?: string
    mintAddress?: string;
  };