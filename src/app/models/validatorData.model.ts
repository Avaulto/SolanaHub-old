export interface ValidatorData{
    name: string;
    image:string;
    vote_identity:string;
    website:string;
    wizScore: number;
    commission: number;
    apy_estimate: number;
    stake?: string;
    uptime: number;
    delegetors?: any;
    skipRate: string
    rank?: ValidatorRank;
}
interface ValidatorRank {
    rank: number;
    numOfValidators: number;
  }