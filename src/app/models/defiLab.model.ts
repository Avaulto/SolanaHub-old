export interface DefiLab {
    labintro: LabIntro
    labStategy: labStategy
}

export interface LabIntro {
    // assetsSymbol: string[],
    apy: number | any,
    depositAssetImgs: string[],
    defiParticipate: string[],
    strategies: string[],
    rewardAsssets: string[],
    learnMoreLink: string,
    deepLink: string,
    strategy:string,
    active: boolean,
    riskLevel: 'low' |'medium' | 'high',
}
export interface labStategy {
    strategy:string,
    apy: number,
    description: string,
    rewards: string[],
    risks: string[],
}