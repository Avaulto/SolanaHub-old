export interface FraktStats {
    totalIssued: number;
    loansTvl: number;
    loansVolumeAllTime: number;
    activeLoansCount: number;
}
export interface FraktLiquidity {
    timeBasedLiqs: TimeBasedLiq[];
    priceBasedLiqs: PriceBasedLiqs[];
}
interface TimeBasedLiq {
    isPriceBased: boolean;
    name: string;
    totalLiquidity: number;
    totalBorrowed: number;
    depositApr: number;
    borrowApr: number;
    activeloansAmount: number;
    collectionsAmount: number;
}

interface PriceBasedLiqs {
    isPriceBased: boolean;
    name: string;
    totalLiquidity: number;
    totalBorrowed: number;
    depositApr: number;
    borrowApr: number;
    activeloansAmount: number;
    collectionsAmount: number;
}
export interface FraktNftItemWithLiquidity {
    slug: string;
    bankseaSlug: string;
    creators: string[];
    hyperspaceSlug: string;
    tensorSlug: string;
    maxAmountOfActiveLoans: number;
    name: string;
    isWhitelisted: boolean;
    updatedAt: Date;
    price: number;
    imageUrl: string;
    isPriceBased: boolean;
    totalLiquidity: number;
    totalBorrowed: number;
    depositApr: number;
    borrowApr: number;
    activeloansAmount: number;
    collectionsAmount: number;
}
export interface FraktNftItem {
    slug: string;
    bankseaSlug: string;
    creators: string[];
    hyperspaceSlug: string;
    tensorSlug: string;
    maxAmountOfActiveLoans: number;
    name: string;
    isWhitelisted: boolean;
    updatedAt: Date;
    price: number;
    imageUrl: string;
}

export interface FraktNftMetadata {
    isDisabled: boolean;
    collectionInfoPubkey: string;
    availableLoanTypes: string;
    collaterizationRate: number;
    createdAt: Date;
    expirationTime: number;
    loanToValue: number;
    pricingLookupAddress: string;
    royaltyFeePrice: number;
    royaltyFeeTime: number;
    updatedAt: Date;
    bankseaInfoPostUrl?: any;
    creator: string;
    hyperspaceSlug: string;
    isTrustedVolume: boolean;
    isWhitelisted: boolean;
    liquidityPool: string;
    maxAmountOfActiveLoans: number;
    name: string;
    priceOracleUri: string;
    royaltyAddress: string;
    tensorSlug: string;
    upperLimit: string;
    isCanFreeze: boolean;
    price: number;
    bankseaSlug: string;
    tier: number;
    volume7d: number;
    volumeWithTiers: number;
    slug: string;
}