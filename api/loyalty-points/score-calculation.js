

import fetch from 'node-fetch';

export default async function LoyaltyPoints(request, response) {
  /**
      @param loyaltyScore;
          group of loyalty score base on various ways to boost Avaulto validator node on Solana blockchain

      @prop nativeLongTermBoost
          boost for long term commitment on native staking, 
          example for a calc:
          stakeSize * (currentEpoch - startedEpoch) * 0.02

      @prop mSOL_DirectStakeBoost & bSOL_DirectStakeBoost
      boost value driven from stake pool delegation strategy allocated stake base on votes

      @prop veMNDE_Boost & veBLZE_Boost
      boost value driven from SPL like MNDE & BLZE, where users can cast their vote to allocate stake from delegation strategy
   */
  const loyaltyScore = {
    nativeLongTermBoost: 0.02, // cap 0.5
    mSOL_DirectStakeBoost: null,
    bSOL_DirectStakeBoost: null,
    veMNDE_Boost: null,
    veBLZE_Boost: null
  }


  const getDirectStakeRatio_bSOL = async () => {
    try {
      const stakeRatio = (await (await fetch('https://stake.solblaze.org/api/v1/cls_boost')).json()).boost.conversion;
      return stakeRatio
    } catch (error) {
      console.error(error)
    }
  }

  const getDirectStakeRatio_mSOL = async () => {
    try {
      const mSOL_total_allocated_stake = (await (await fetch('https://api.marinade.finance/tlv')).json()).total_sol * 0.2;
      const AvaultoVoteKey = '7K8DVxtNJGnMtUY1CQJT5jcs8sFGSZTDiG7kowvFpECh';
      const msol_votes_ds = (await (await fetch('https://snapshots-api.marinade.finance/v1/votes/msol/latest')).json())
      const totalDirectStake = msol_votes_ds.records.filter(record => record.amount).reduce(
        (accumulator, currentValue) => accumulator + Number(currentValue.amount),
        0
      );
      const singleDirectStake = Number(msol_votes_ds.records.filter(record => record.amount > 0 && record.validatorVoteAccount === AvaultoVoteKey)[0].amount)

      // how much % each stake control out of the total ds
      const singleStakeControlInPercentage = singleDirectStake / totalDirectStake
      // how much total SOL the validator will recive 
      const totalSOLForTheValidator = singleStakeControlInPercentage * mSOL_total_allocated_stake;
      const stakeRatio = totalSOLForTheValidator / singleDirectStake
      return stakeRatio
    } catch (error) {
      console.error(error)
    }

  }

  const getVotesRatio_MNDE = async () => {
    try {
      const mSOL_total_allocated_stake = (await (await fetch('https://api.marinade.finance/tlv')).json()).total_sol * 0.2;
      const AvaultoVoteKey = '7K8DVxtNJGnMtUY1CQJT5jcs8sFGSZTDiG7kowvFpECh';
      const mnde_votes = (await (await fetch('https://snapshots-api.marinade.finance/v1/votes/vemnde/latest')).json())
      const totalVotes = mnde_votes.records.filter(record => record.amount).reduce(
        (accumulator, currentValue) => accumulator + Number(currentValue.amount),
        0
      );
      const singleVote = Number(mnde_votes.records.filter(record => record.amount > 0 && record.validatorVoteAccount === AvaultoVoteKey)[0].amount)

      // how much % each stake control out of the total ds
      const singleVoteControlInPercentage = singleVote / totalVotes
      // how much total SOL the validator will recive 
      const totalSOLForTheValidator = singleVoteControlInPercentage * mSOL_total_allocated_stake;
      const stakeRatio = totalSOLForTheValidator / singleVote
      return stakeRatio
    } catch (error) {
      console.error(error)
    }

  }

  const getVotesRatio_BLZE = () => {

  }

  try {
    loyaltyScore.bSOL_DirectStakeBoost = await getDirectStakeRatio_bSOL();
    loyaltyScore.mSOL_DirectStakeBoost = await getDirectStakeRatio_mSOL();
    loyaltyScore.veMNDE_Boost = await getVotesRatio_MNDE();
    return response.status(200).json(loyaltyScore);
  } catch (error) {
    console.error(error)
    return response.status(500).json(error);
  }



}

