import { Asset } from "./assets.model"

export interface DefiLab {
  labintro: LabIntro
  labStategy: LabStrategyConfiguration
}

export interface LabIntro {
  // assetsSymbol: string[],
  apy: number | any,
  defiParticipate: string[],
  strategies: string[],
  rewardAsssets: string[],
  learnMoreLink: string,
  strategy: string,
  active: boolean,
  riskLevel: 'low' | 'medium' | 'high',
}
export interface LabStrategyConfiguration {
  strategyName: string,
  title: string,
  rewardsSlogan: string,
  description: string,
  strategyIcon: string,
  APY_breakdown: APY_breakdown[],
  risk_breakdown: Risk_breakdown[],
  strategy_breakdown: string[],
  totalTransactions: number,
  claimAssets: claimAsset,
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
interface claimAsset {
  name: string,
  amount: number,
  toBeClaim?: number
}
