export interface WhirlPoolsStats {
    tvl: KeyPair
    vol: KeyPair
    weeklyReward: KeyPair
    orcaPrice: KeyPair
}
interface KeyPair {
    title: string,
    value: string,
    description?: string;
}
export interface OrcaWhirlPool {
    whirlpools: Whirlpool[];
    hasMore: boolean;
}

export interface Whirlpool {
    address: string;
    tokenA: Token;
    tokenB: Token;
    whitelisted: boolean;
    tickSpacing: number;
    price: number;
    lpFeeRate: number;
    protocolFeeRate: number;
    whirlpoolsConfig: WhirlpoolsConfig;
    modifiedTimeMs?: number;
    tvl?: number;
    volume?: FeeAPR;
    volumeDenominatedA?: FeeAPR;
    volumeDenominatedB?: FeeAPR;
    priceRange?: PriceRange;
    feeApr?: FeeAPR;
    reward0Apr?: FeeAPR;
    reward1Apr?: FeeAPR;
    reward2Apr?: FeeAPR;
    totalApr?: FeeAPR;
}

export interface FeeAPR {
    day: number;
    week: number | null;
    month: number | null;
}

export interface PriceRange {
    day: Day;
    week: Day;
    month: Day;
}

export interface Day {
    min: number;
    max: number;
}

export interface Token {
    mint: string;
    symbol: string;
    name: string;
    decimals: number;
    logoURI: null | string;
    coingeckoId: null | string;
    whitelisted: boolean;
    poolToken: boolean;
    wrapper?: Wrapper;
}

export enum Wrapper {
    Srm = "SRM",
}

export enum WhirlpoolsConfig {
    The2LecshUwdy9Xi7MeFgHTFJQNSKk4KdTrcpvaB56DP2NQ = "2LecshUwdy9xi7meFgHtFJQNSKk4KdTrcpvaB56dP2NQ",
}
