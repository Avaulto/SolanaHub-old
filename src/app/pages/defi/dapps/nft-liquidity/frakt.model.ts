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

export interface CollectionInfo {
    lockedNftsInLoans: number;
    loansVolumeAllTime: number;
    loansVolume7Days: string;
    TVL: number;
    issuedIn24Hours: number;
    liquidatedIn24Hours: number;
    paidBackIn24Hours: number;
    totalIssued: number;
    utilizationRateInPercent: string;
    liquidityPoolApr: string;
}



    export interface TimeBased {
        returnPeriodDays: number;
        loanValue: number;
        ltvPercent: number;
        fee: number;
        feeDiscountPercent: number;
        repayValue: number;
        liquidityPoolPubkey: string;
        isBest: boolean;
    }

    export interface ClassicParams {
        maxLoanValue: number;
        timeBased: TimeBased;
    }

    export interface BondParams {
    }

    export interface BorrowNft {
        mint: string;
        name: string;
        collectionName: string;
        imageUrl: string;
        valuation: number;
        freezable: boolean;
        classicParams: ClassicParams;
        bondParams: BondParams;
    }

    export interface Order {
        loanType: string;
        loanValue: number;
        borrowNft: BorrowNft;
    }

    export interface BestBorrowSuggtion {
        orders: Order[];
    }



