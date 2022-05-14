export interface Asset {
    name:string;
    addr: any;
    addrShort: string;
    balance: number;
    baseOfPortfolio:string;
    icon: string;
    coinData?: CoinData | any;
    tokens?: Asset[]
  }

  export interface CoinData {
    name: string,
    price: {btc: number, usd:number},
    price_change_percentage_24h_in_currency: {btc: number,usd:number},
    desc: string,
    image: {thumb,small, large},
    website: string,
  };