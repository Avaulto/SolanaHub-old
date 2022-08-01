import { ValidatorData } from "./validatorData.model";

export interface StakeAccountExtended {
    addr: string;
    shortAddr?: string;
    balance: number;
    state?: 'active' | 'inactive' | 'activating' | 'deactivating';
    validatorData?: ValidatorData
  }