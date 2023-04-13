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



export interface BestBorrowSuggtion {
    mint: string
    name: string
    imageUrl: string
    collectionName: string
    maxLoanValue: number;
    valuation: number
    freezable: boolean
    classicParams: ClassicParams
}

interface ClassicParams {
    maxLoanValue: any
    isLimitExceeded: boolean
    timeBased: TimeBased
    priceBased: PriceBased
}
interface PriceBased {
    liquidityPoolPubkey: string,
    ltvPercent: number,
    borrowAPRPercent: number,
    collaterizationRate: number
}
interface TimeBased {
    liquidityPoolPubkey: string
    returnPeriodDays: number
    ltvPercent: number
    fee: any
    feeDiscountPercent: number
    loanValue: number
    repayValue: number
}



export interface OpenLoan {
    user: string;
    pubkey: string;
    loanType: string;
    loanValue: number;
    repayValue: number;
    startedAt: number;
    nft: {
        mint: string;
        name: string;
        imageUrl: string;
        collectionName: string;
    }

    classicParams: {
        liquidityPool: string;
        collectionInfo: string;
        royaltyAddress: string;
        nftUserTokenAccount: string;
        timeBased?: {
            expiredAt: number;
        };
        priceBased?: {
            borrowAPRPercent: number;
            health: number,
            liquidationPrice: number,
            realLiquidationPrice: number,
            nftOriginalPrice: number
        }
    }

}


export interface AllUserStats {
    bonds: Bonds;
    totalStats: TotalStats;
    dailyActivity: DailyActivity;
    lastLoans: LastLoan[];
    lendingPools: LendingPool[];
}

export interface Bonds {
    activeUserLoans: number;
    bondUserAmount: number;
    userOffers: number;
    userOffersAmount: number;
}

export interface DailyActivity {
    dailyVolume: number;
    issuedIn24Hours: number;
    paidBackIn24Hours: number;
    liquidatedIn24Hours: number;
    grace: number;
    lockedNftsInLoans: number;
}

export interface LastLoan {
    loanValue: number;
    startedAt: number;
    image: string;
    nftName: string;
}

export interface LendingPool {
    image: string[];
    nftName: string;
    apr: number;
    tvl: number;
    collectionsCount?: number;
}

export interface TotalStats {
    totalIssued: number;
    loansTvl: number;
    loansVolumeAllTime: number;
    activeLoansCount: number;
    userTotalLiquidity: number;
}

export interface UserRewards {
    lenders: [],
    borrowers: []
}

export interface PoolIO {
    pubkey:                string;
    isPriceBased:          boolean;
    name:                  string;
    imageUrl:              string[];
    totalLiquidity:        number;
    totalBorrowed:         number;
    utilizationRate:       number;
    depositApr:            number;
    borrowApr:             number;
    activeloansAmount:     number;
    collectionsAmount:     number;
    userDeposit:           UserDeposit;
    userActiveLoansAmount: number;
}

export interface UserDeposit {
    pubkey:                string;
    harvestAmount:         number;
    depositAmount:         number;
    depositAmountLamports: string;
}
