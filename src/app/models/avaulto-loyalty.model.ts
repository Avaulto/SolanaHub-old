export interface LoyaltyLeaderBoard {
    ptsCalcIncludePoolShare: PtsCalcIncludePoolShare[];
  }
  
  export interface PtsCalcIncludePoolShare {
    walletOwner:    string;
    loyaltyPoints:  number;
    breakDown:      BreakDown;
    prizePoolShare: number;
  }
  
  export interface BreakDown {
    nativeStakePts: number;
    bSOLpts:        number;
    mSOLpts:        number;
    veMNDEpts:      number;
  }
  