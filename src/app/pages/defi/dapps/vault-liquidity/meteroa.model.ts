export interface MeteoraStats{
  TVL:number;
  totalValueEarn: number
}
export interface VaultsInfo {
    symbol: string
    token_address: string
    pubkey: string
    is_monitoring: boolean
    vault_order: number
    usd_rate: number
    closest_apy: number
    average_apy: number
    long_apy: number
    earned_amount: number
    virtual_price: string
    enabled: number
    lp_mint: string
    fee_pubkey: string
    total_amount: number
    total_amount_with_profit: number
    token_amount: number
    fee_amount: number
    lp_supply: number
    earned_usd_amount: number
    strategies: Strategy[]
    timestamp: number
  }
  
  export interface Strategy {
    pubkey: string
    reserve: string
    strategy_type: string
    strategy_name: string
    liquidity: number
    max_allocation: number
    isolated: boolean
    disabled: boolean
    safe_utilization_threshold: number
  }