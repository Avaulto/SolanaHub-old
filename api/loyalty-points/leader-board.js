

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
            const [AvaultoLoyaltyScore, validatorsBribe] = await Promise.all([_getScore(),_getValidatorBribe() ])

            const ptsCalc = validatorsBribe.map(staker => {
                // stake account aging
                const nativeStakePts =(staker.nativeStake.amount * (1 + AvaultoLoyaltyScore.nativeStakeLongTermBoost))
                const bSOLpts = (staker.bSOL_directStake * AvaultoLoyaltyScore.bSOL_DirectStakeBoost)
                const mSOLpts = (staker.mSOL_directStake * AvaultoLoyaltyScore.mSOL_DirectStakeBoost)
                const veMNDEpts = (staker.mSOL_votePower * AvaultoLoyaltyScore.veMNDE_Boost)
                let loyaltyPoints = nativeStakePts + bSOLpts + mSOLpts + veMNDEpts
                //  AvaultoLoyaltyScore.compactDeFi_Boost;
                return { walletOwner: staker.walletOwner, loyaltyPoints, breakDown: {nativeStakePts,bSOLpts,mSOLpts,veMNDEpts} }
              })
              const ptsNoDuplication = Array.from(new Set(ptsCalc.map(s => s.walletOwner)))
                .map(walletOwner => {
                 const loyaltyPoints = ptsCalc.filter(s => s.walletOwner === walletOwner).reduce(
                    (accumulator, currentValue) => accumulator + Number(currentValue.loyaltyPoints),
                    0
                  );
                  return {
                    walletOwner,
                    loyaltyPoints
                  }
                })
            return ptsNoDuplication
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

