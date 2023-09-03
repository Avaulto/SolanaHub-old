
  export interface LoyaltyLeaderBoard {
    AvalutoLoyaltyPoints: AvalutoLoyaltyPoint[];
    totalPoints:          number;
    snapshotDate:         Date;
}

export interface AvalutoLoyaltyPoint {
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
