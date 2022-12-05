export interface FriktionLocal {
    tvl: number,
    volume: number,
    totalProduct: number,
    topPerformingAsset: string
}
export interface FriktionVol {
    globalId: string,
    volume: number
}

export interface FriktionMarket {
    updateTime: number;
    totalTvlUSD: number;
    coinsByCoingeckoId: { [key: string]: number };
    pricesByCoingeckoId: { [key: string]: number };
    sharePricesByGlobalId: { [key: string]: number | null };
    depositTokenByGlobalId: { [key: string]: number | null };
    usdValueByGlobalId: { [key: string]: number | null };
    globalIdToDepositTokenCoingeckoId: GlobalIDToDepositTokenCoingeckoID;
    apyByGlobalId: { [key: string]: number | null };
    allMainnetVolts: AllMainnetVolt[];
    allDevnetVolts: any[];
}

export interface AllMainnetVolt {
    globalId: string;
    depositTokenImage?: string;
    underlineTokenImage?: string;
    voltVaultId: string;
    extraVaultDataId: string;
    vaultAuthority: string;
    quoteMint: QuoteMint;
    underlyingMint: string;
    depositTokenMint: string;
    shareTokenMint: string;
    shareTokenSymbol: string;
    shareTokenDecimals: number;
    depositPool: string;
    premiumPool: string;
    spotSerumMarketId: string;
    depositTokenSymbol: string;
    depositTokenCoingeckoId: string;
    underlyingTokenSymbol: string;
    underlyingTokenCoingeckoId: string;
    voltType: number;
    apy: number | null;
    isVoltage: boolean;
    isInCircuits: boolean;
    highVoltage: HighVoltage;
    shareTokenPrice: number;
    depositTokenPrice: number;
    tvlUsd: number;
    tvlDepositToken: number;
    capacityUsd: number;
    capacityDepositToken: number;
    latestEpochYield: number | null;
    weeklyPy: number | null;
    monthlyPy: number | null;
    apr: number | null;
    apyAfterFees: number | null;
    performanceFeeRate: number;
    withdrawalFeeRate: number;
    aumFeeRateAnnualized: number;
    nextAutocompoundingTime: number;
    lastTradedOption: string;
    abnormalEpochLength?: number;
    tokenBalance?: number;
}

export enum HighVoltage {
    Empty = "",
    MainnetIncomeCallSolHigh = "mainnet_income_call_sol_high",
    MainnetIncomePutSolHigh = "mainnet_income_put_sol_high",
}

export enum QuoteMint {
    EPjFWdd5AufqSSqeM2QN1XzybapC8G4WEGGkZwyTDt1V = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    The9VMJfxuKxXBoEa7RM12MYLMwTacLMLDJqHozw96WQL8I = "9vMJfxuKxXBoEa7rM12mYLMwTacLMLDJqHozw96WQL8i",
}

export interface GlobalIDToDepositTokenCoingeckoID {
    mainnet_income_call_aptos: string;
    mainnet_income_call_sol: string;
    mainnet_income_call_sol_high: string;
    mainnet_income_call_btc: string;
    mainnet_income_call_eth: string;
    mainnet_income_call_stsol: string;
    mainnet_income_call_avax: string;
    mainnet_income_call_marinade: string;
    mainnet_income_call_ftt: string;
    mainnet_income_call_srm: string;
    mainnet_income_call_step: string;
    mainnet_income_call_samo: string;
    mainnet_income_call_near: string;
    mainnet_income_call_sbr: string;
    mainnet_income_call_mngo: string;
    mainnet_income_call_ray: string;
    mainnet_income_call_socean: string;
    mainnet_income_call_luna: string;
    mainnet_income_put_sol: string;
    mainnet_income_put_sol_high: string;
    mainnet_income_put_btc: string;
    mainnet_income_put_eth: string;
    mainnet_income_put_pai: string;
    mainnet_income_put_tsUSDC: string;
    mainnet_income_call_btc_step_circuits: string;
    mainnet_income_call_sol_step_circuits: string;
    mainnet_income_put_sol_step_circuits: string;
    mainnet_income_call_sol_parrot_circuits: string;
    mainnet_income_put_sol_parrot_circuits: string;
    mainnet_income_put_btc_step_circuits: string;
    mainnet_income_put_btc_circuits_e262dc86: string;
    mainnet_income_put_sol_uxd_circuits: string;
    mainnet_income_put_mngo: string;
    mainnet_income_put_uxd: string;
    mainnet_income_put_luna: string;
    mainnet_income_perp_btc: string;
    mainnet_basis_usdc_sol: string;
    mainnet_basis_usdc_btc: string;
    mainnet_protection_usdc_sol: string;
}
