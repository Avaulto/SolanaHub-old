export interface ValidatorBribe {
    _id:                string;
    validatorBribeData: validatorBribeData[];
    totalStake:         number;
    date:               Date;
}

export interface validatorBribeData {
    walletOwner:       string;
    nativeStake:       number;
    stakeAccountAging: number;
    mSOL_directStake:  number;
    veMNDE_Votes:      number;
    bSOL_directStake:  number;
}
