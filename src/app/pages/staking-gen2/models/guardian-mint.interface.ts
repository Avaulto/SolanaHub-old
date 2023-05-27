export interface GuardianToMint {
    tier: string;
    minStake: number;
    img: string;
    perks:Perks[]
  }

  interface Perks {
    name:string;
    icon: string;
  }