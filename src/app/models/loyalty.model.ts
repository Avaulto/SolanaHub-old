
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
    breakdown:    Breakdown;
}

export interface Breakdown {
    directStakeRebate: number;
    BLZEAirdrop:       BLZEAirdrop;
}

export interface BLZEAirdrop {
    weekly_BLZE_emmistion: number;
    BLZE_TO_SOL:           number;
}
