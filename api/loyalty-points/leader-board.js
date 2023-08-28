

export default async function GetLeaderBoard(request, response) {
    async function _getScore() {
        const loyaltyScore = await (await fetch('https://dev.compact-defi.xyz/api/loyalty-points/score-calculator')).json()
        return loyaltyScore
    }
    async function _getValidatorBribe() {
        const validatorBribe = await (await fetch(`https://dev.compact-defi.xyz/api/loyalty-points/get-validator-bribe`)).json()
        return validatorBribe
    }

    async function loyaltyPointsCalc() {
        try {
            const [AvaultoLoyaltyScore, bribeRecord] = await Promise.all([_getScore(), _getValidatorBribe()])

            const ptsCalc = bribeRecord.validatorBribeData.map(staker => {
                // stake account aging
                const nativeStakePts = (staker.nativeStake * staker.stakeAccountAging * (1 + AvaultoLoyaltyScore.nativeStakeLongTermBoost))
                const bSOLpts = (staker.bSOL_directStake * AvaultoLoyaltyScore.bSOL_DirectStakeBoost)
                const mSOLpts = (staker.mSOL_directStake * AvaultoLoyaltyScore.mSOL_DirectStakeBoost)
                const veMNDEpts = (staker.mSOL_votePower * AvaultoLoyaltyScore.veMNDE_Boost)
                let loyaltyPoints = nativeStakePts + bSOLpts + mSOLpts + veMNDEpts
                //  AvaultoLoyaltyScore.compactDeFi_Boost;
                return { walletOwner: staker.walletOwner, loyaltyPoints, breakDown: { nativeStakePts, bSOLpts, mSOLpts, veMNDEpts } }
            })
            const totalPts = ptsCalc.reduce(
                (accumulator, currentValue) => accumulator + Number(currentValue.loyaltyPoints),
                0
            );
            console.log({ ptsCalc, totalPts })
            return { ptsCalc, totalPts, snapshotDate: bribeRecord.date }
        } catch (error) {
            console.log(error)
        }
    }
    try {
        const loyaltyPoints = await loyaltyPointsCalc()
        return response.status(200).json(loyaltyPoints);
    } catch (error) {
        console.error(error)
        // return response.status(500).json(error);
    }
}

