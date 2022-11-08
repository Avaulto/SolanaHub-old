import { ValidatorData } from "./validatorData.model";

export interface StakeAccountExtended {
  name?: string,
  addr?: string;
  shortAddr?: string;
  balance?: number;
  state?: 'active' | 'inactive' | 'activating' | 'deactivating';
  validatorData?: ValidatorData,
  extraData?;
  checkedForMerge: boolean
}