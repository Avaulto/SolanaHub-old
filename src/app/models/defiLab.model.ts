import { Asset } from "./assets.model"

export interface DefiLab {
  labintro: LabIntro
  labStategy: LabStrategyConfiguration
}

export interface LabIntro {
  id:number,
  // assetsSymbol: string[],
  apy: number | any,
  defiParticipate: string[],
  strategies: string[],
  rewardAsssets: string[],
  learnMoreLink: string,
  strategy: string,
  active: boolean,
  riskLevel: 1 | 2 | 3 //  'low' | 'medium' | 'high',
  userDeposit: any
}
enum riskLevel {
  Up = 1,
  Down,
  Left,
  Right,
}
export interface LabStrategyConfiguration {
  strategyName: string,
  title: string,
  protocolsTitle: string,
  rewardsSlogan: string,
  description: string,
  strategyIcon: string,
  APY_breakdown: APY_breakdown[],
  risk_breakdown: Risk_breakdown[],
  strategy_breakdown: string[],
  totalTransactions: number,
  claimAssets: StrategyClaimableAsset[],
  assetHoldings: Asset[]
}

interface APY_breakdown {
  icon: string,
  description: string
}
interface Risk_breakdown {
  riskLevel: string,
  description: string,
}
export interface StrategyClaimableAsset {
  name: string,
  amount: number,
  toBeClaim?: number
}
