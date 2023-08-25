import { Connection, PublicKey } from "@solana/web3.js";

export default async function GetLeaderBoard(request, response) {
    const { validatorVoteKey } = request.query;
    async function _getNativeDelegetors() {
        const currentEpoch = (await new Connection.getEpochInfo()).epoch
        let delegators = []
        try {
            const config = {
                // encoding:'jsonParsed' as any,
                filters: [{
                    // dataSize: 200,    //size of account (bytes)
                    memcmp: {
                        offset: 124,     //location of our query in the account (bytes)
                        bytes: validatorVoteKey,  //our search criteria, a base58 encoded string
                    }
                }]
            };
            let delegatorsParsed = await new Connection.getParsedProgramAccounts(new PublicKey('Stake11111111111111111111111111111111111111'), config)
            delegators = delegatorsParsed.map(account => {
                const accountData = account.account.data['parsed'].info
                return {
                    ageInEpochs: currentEpoch - accountData.stake.delegation.activationEpoch,
                    account: account.pubkey.toBase58(),
                    walletOwner: accountData.meta.authorized.withdrawer,
                    amount: accountData.stake.delegation.stake / LAMPORTS_PER_SOL
                }
            })
        } catch (error) {
            console.warn(error);
        }
        return delegators
    }



    async function _getValidatorMSOLDirectStake() {
        const snapshot = (await (await fetch('https://snapshots-api.marinade.finance/v1/votes/msol/latest')).json())
        const record = snapshot.records.filter(vote => Number(vote.amount) && vote.validatorVoteAccount === validatorVoteKey)
        const Validator_mSOL_DS = record
        return Validator_mSOL_DS;
    }
    async function _getValidatorBSOLDirectStake() {
        const snapshot = (await (await fetch('https://stake.solblaze.org/api/v1/cls_boost')).json())
        const Validator_bSOL_DS = snapshot.applied_stakes[validatorVoteKey]
        return Validator_bSOL_DS;
    }
    async function _getValidatorMNDEVotes() {
        const mnde_votes = await (await fetch('https://snapshots-api.marinade.finance/v1/votes/vemnde/latest')).json()
        const ValidatormSOL_Votes = mnde_votes.records.filter(vote => Number(vote.amount) && vote.validatorVoteAccount === validatorVoteKey)
        return ValidatormSOL_Votes
    }
    async function _getBLZEVotes() {
    }
    async function _getScore() {
        const allScores = await (await fetch('https://dev.compact-defi.xyz/api/loyalty-points/score-calculator')).json()
        return allScores
    }
    // steps to calc
    // 1. fetch all delegators
    // 2. look up stakers from various staking options by wallet owner
    // 3. gather all info into one object
    // 4. evaluate how much score each property is worth
    // 5. combine all the scores
    // 6. add multipliers
    // return the score & break down
    async function loyaltyPointsCalc() {
        try {
            const [allScores, delegetors, Validator_mSOL_DS, Validator_mSOL_Votes, Validator_bSOL_DS] = await Promise.all([
                _getScore(),
                _getNativeDelegetors(),
                _getValidatorMSOLDirectStake(),
                _getValidatorMNDEVotes(),
                _getValidatorBSOLDirectStake(),
            ]);



            const delegtorsExended = delegetors.map(staker => {
                const mSOL_directStake = Validator_mSOL_DS.find(ds => ds.tokenOwner === staker.walletOwner)?.amount || 0;
                const mSOL_votePower = Validator_mSOL_Votes.find(ds => ds.tokenOwner === staker.walletOwner)?.amount || 0;
                const bSOL_directStake = Number(Validator_bSOL_DS[staker.walletOwner]) || 0;
    
                const nativeStake = { amount: staker.amount, ageInEpochs: staker.ageInEpochs, account: staker.account }
                return { walletOwner: staker.walletOwner, nativeStake, mSOL_directStake, mSOL_votePower, bSOL_directStake }
              })
    
              const ptsCalc = delegtorsExended.map(staker => {

                let loyaltyPoints = (staker.nativeStake.amount * (1 + allScores.nativeStakeLongTermBoost))
                  + (staker.bSOL_directStake * allScores.bSOL_DirectStakeBoost)
                  + (staker.mSOL_directStake * allScores.mSOL_DirectStakeBoost)
                  * allScores.veMNDE_Boost
                //  allScores.compactDeFi_Boost;
                return { walletOwner: staker.walletOwner, loyaltyPoints }
              })
              const ptsNoDuplication = Array.from(new Set(ptsCalc.map(s => s.walletOwner)))
                .map(walletOwner => {
                 const loyaltyPoints =   scoreCalc.filter(s => s.walletOwner === walletOwner).reduce(
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

