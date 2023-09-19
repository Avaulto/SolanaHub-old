
  export interface LoyaltyLeaderBoard {
    loyaltyPoints: LoyaltyPoint[];
    totalPoints:          number;
    snapshotDate:         Date;
}

export interface LoyaltyPoint {
    walletOwner:     string;
    loyaltyPoints:   number;
    pointsBreakDown: PointsBreakDown;
    prizePoolShare:  number;
}

export interface PointsBreakDown {
    nativeStakePts: number;
    bSOLpts:        number;
    mSOLpts:        number;
    veMNDEpts:      number;
}


export interface PrizePool {
    totalRebates: number;
    APR_boost: number;
}

