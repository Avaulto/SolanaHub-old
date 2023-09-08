

export default async function GetLeaderBoard(request, response) {
    async function _getScore() {
        const loyaltyScore = await (await fetch('https://dev.SolanaHub.app/api/loyalty-points/score-calculator')).json()
        return loyaltyScore
    }
    async function _getValidatorBribe() {
        const validatorBribe = await (await fetch(`https://dev.SolanaHub.app/api/loyalty-points/get-validator-bribe`)).json()
        return validatorBribe
    }

    async function loyaltyPointsCalc() {
        try {
            const [LoyaltyScore, bribeRecord] = await Promise.all([_getScore(), _getValidatorBribe()])

            const ptsCalc = bribeRecord.validatorBribeData.map(staker => {
                let agingBooster = staker.stakeAccountAging * LoyaltyScore.nativeStakeLongTermBoost;
                agingBooster = agingBooster > 0.50 ? 0.50 : agingBooster
                // stake account aging
                const nativeStakePts = (staker.nativeStake * (agingBooster + 1))
                const bSOLpts = (staker.bSOL_directStake * LoyaltyScore.bSOL_DirectStakeBoost)
                const mSOLpts = (staker.mSOL_directStake * LoyaltyScore.mSOL_DirectStakeBoost)
                const veMNDEpts = (staker.mSOL_votePower * LoyaltyScore.veMNDE_Boost)
                // const veBLZEpts = (staker.bSOL_votePower * LoyaltyScore.veBLZE_Boost)
                let loyaltyPoints = nativeStakePts + bSOLpts + mSOLpts + veMNDEpts 
  
                return { walletOwner: staker.walletOwner, loyaltyPoints, pointsBreakDown: { nativeStakePts, bSOLpts, mSOLpts, veMNDEpts } }
            })
            const totalPts = ptsCalc.reduce(
                (accumulator, currentValue) => accumulator + Number(currentValue.loyaltyPoints),
                0
            );
            const ptsCalcIncludePoolShare = ptsCalc.map(loyaltyStaker =>{
                const prizePoolShare = loyaltyStaker.loyaltyPoints / totalPts
                return {...loyaltyStaker, prizePoolShare}
            }).sort((a, b) => b.loyaltyPoints - a.loyaltyPoints)
            return { AvalutoLoyaltyPoints: ptsCalcIncludePoolShare, totalPoints:totalPts, snapshotDate: bribeRecord.date }
        } catch (error) {
            console.log(error)
        }
    }
    try {
        const loyaltyPoints = await loyaltyPointsCalc()
        console.log(loyaltyPoints)
        return response.status(200).json(loyaltyPoints);
    } catch (error) {
        console.error(error)
        // return response.status(500).json(error);
    }
}

