import { ValidatorData } from "./validatorData.model";

export interface StakeAccountExtended {
  name?: string,
  addr?: string;
  validatorVoteKey: string;
  shortAddr?: string;
  startEpoch: string;
  excessLamport: number;
  balance?: number;
  state?: 'active' | 'inactive' | 'activating' | 'deactivating';
  validatorData?: ValidatorData,
  extraData?;
  checkedForMerge: boolean,
  canMerge?: boolean
}