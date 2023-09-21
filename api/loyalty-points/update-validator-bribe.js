import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { MongoClient, ServerApiVersion } from 'mongodb';
const uri = process.env.MONGODB_URI;
const key = process.env.updateBribeKey
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export default async function UpdateValidatorBribe(request, response) {
    if (request.query.key !== key) {
        response.status(404).end();
        return;
    }

    const validatorVoteKey = '7K8DVxtNJGnMtUY1CQJT5jcs8sFGSZTDiG7kowvFpECh'
    async function _getNativeDelegetors() {
        const connection = new Connection('https://solana-mainnet.rpc.extrnode.com')
        const currentEpoch = (await connection.getEpochInfo()).epoch
        let delegators = []
        try {
            const config = {
                filters: [{
                    memcmp: {
                        offset: 124,     //location of our query in the account (bytes)
                        bytes: validatorVoteKey,  //our search criteria, a base58 encoded string
                    }
                }]
            };
            let delegatorsParsed = await connection.getParsedProgramAccounts(new PublicKey('Stake11111111111111111111111111111111111111'), config)
            delegators = delegatorsParsed.map(account => {
                const accountData = account.account.data['parsed'].info
                return {
                    ageInEpochs: currentEpoch - accountData.stake.delegation.activationEpoch,
                    account: account.pubkey.toBase58(),
                    walletOwner: accountData.meta.authorized.withdrawer,
                    amount: accountData.stake.delegation.stake / LAMPORTS_PER_SOL
                }
            }).filter(acc => Number(acc.amount) > 0.01)
        } catch (error) {
            console.warn(error);
        }
        return delegators
    }



    async function _getValidatorMSOLDirectStake() {
        const msolPrice =  await (await fetch(`https://api.marinade.finance/msol/price_sol`)).json()
        const snapshot = (await (await fetch('https://snapshots-api.marinade.finance/v1/votes/msol/latest')).json())
        const record = snapshot.records.filter(vote => Number(vote.amount) > 0.01 && vote.validatorVoteAccount === validatorVoteKey).map(votes => {
            return {
                walletOwner: votes.tokenOwner,
                mSOL_directStake: Number(votes.amount * msolPrice)
            }
        })
        const Validator_mSOL_DS = record
        return Validator_mSOL_DS;
    }
    async function _getValidator_veMNDEVotes() {
        const mnde_votes = await (await fetch('https://snapshots-api.marinade.finance/v1/votes/vemnde/latest')).json()
        const ValidatorveMNDE_Votes = mnde_votes.records.filter(vote => Number(vote.amount) > 0.01 && vote.validatorVoteAccount === validatorVoteKey).map(votes => {
            return {
                walletOwner: votes.tokenOwner,
                veMNDE_Votes: Number(votes.amount)
            }
        })
        return ValidatorveMNDE_Votes
    }
    async function _getValidatorBSOLDirectStake() {
        const bsolPrice =  await (await fetch(`https://stake.solblaze.org/api/v1/conversion`)).json()
        const snapshot = (await (await fetch('https://stake.solblaze.org/api/v1/cls_boost')).json())
        const Validator_bSOL_DS = snapshot.applied_stakes[validatorVoteKey]

        let Validator_bSOL_DS_arr = Object.keys(Validator_bSOL_DS).map((v, i) => {
            const walletOwner = v;
            const amount = Number(Validator_bSOL_DS[walletOwner] * bsolPrice.conversion.bsol_to_sol);
            let bSOL_directStake = {
                walletOwner,
                bSOL_directStake: amount,
            }
            return bSOL_directStake;
        }).filter(v => Number(v.bSOL_directStake) > 0.01)
        return Validator_bSOL_DS_arr;
    }

    async function _getValidator_veBLZEVotes() {
        return 0;
    }


    async function calcTotalStake(allStake){
        const loyaltyScore = await (await fetch('https://dev.solanahub.app/api/loyalty-points/score')).json()

        const totalSOL_Stake = allStake.reduce(
            (accumulator, currentValue) => accumulator + Number(currentValue.nativeStake) + 
                                                         Number(currentValue.mSOL_directStake) + 
                                                         Number(currentValue.bSOL_directStake) + 
                                                         Number(currentValue.veMNDE_Votes * loyaltyScore.veMNDE_Boost),
            0
        )
        return totalSOL_Stake
    }
    async function validatorBribeData() {
        try {
            const [delegetors, Validator_mSOL_DS, Validator_veMNDE_Votes, Validator_bSOL_DS] = await Promise.all([
                _getNativeDelegetors(),
                _getValidatorMSOLDirectStake(),
                _getValidator_veMNDEVotes(),
                _getValidatorBSOLDirectStake(),
                // _getValidator_veBLZEVotes(),
            ]);

            const stakerAll = [...delegetors, ...Validator_mSOL_DS, ...Validator_veMNDE_Votes, ...Validator_bSOL_DS]
            // pools order ['marinade','solblaze','jito', 'solana foundation', 'Alameda Staking #1']
            const excludeWallets = [
                "9eG63CdHjsfhHmobHgLtESGC8GabbmRcaSpHAZrtmhco",
                "6WecYymEARvjG5ZyqkrVQ6YkhPfujNzWpSPwNKXHCbV2",
                "6iQKfEyhr3bZMotVkW6beNZz5CPAkiwvgV2CTje9pVSS",
                "4ZJhPQAgUseCsWhKvJLTmmRRUV74fdoTpQLNfKoekbPY",
                "EhYXq3ANp5nAerUpbSgd7VK2RRcxK1zNuSQ755G5Mtxx"
            ]


            const validatorsBribe = Array.from(new Set(stakerAll.map(s => s.walletOwner))).filter(s => !excludeWallets.includes(s))
                .map((walletOwner, i) => {

                    // merge amount of multiple stake accounts owned by same wallet owner
                    const nativeStake = delegetors.filter(s => s.walletOwner === walletOwner).reduce(
                        (accumulator, currentValue) => accumulator + Number(currentValue.amount),
                        0
                    ) || 0;
                    const stakeAccountAging = delegetors.find(s => s.walletOwner === walletOwner)?.ageInEpochs || 0;
                    const mSOL_directStake = Validator_mSOL_DS.find(s => s.walletOwner === walletOwner)?.mSOL_directStake || 0;
                    const veMNDE_Votes = Validator_veMNDE_Votes.find(s => s.walletOwner === walletOwner)?.veMNDE_Votes || 0;
                    const bSOL_directStake = Validator_bSOL_DS.find(s => s.walletOwner === walletOwner)?.bSOL_directStake || 0;
                    return {
                        walletOwner,
                        nativeStake,
                        stakeAccountAging,
                        mSOL_directStake,
                        veMNDE_Votes,
                        bSOL_directStake
                    }
                })
                .filter(stake => stake.nativeStake + stake.mSOL_directStake + stake.veMNDE_Votes + stake.bSOL_directStake < 1 )
            return validatorsBribe
        } catch (error) {
            console.log(error)
        }
    }
    async function storeValidatorBribe(storeRecord, totalStake) {
        await client.connect();
        const db = client.db("CDv1")
        const collection = db.collection('validator-bribe')
        await collection.insertOne({ validatorBribeData: storeRecord,totalStake, date: new Date() });
        return true
    }
    try {
        const validatorsBribe = await validatorBribeData()
        const totalStake = await calcTotalStake(validatorsBribe);

        await storeValidatorBribe(validatorsBribe, totalStake)
        return response.status(200).json({ message: 'saved!' });
    } catch (error) {
        console.warn(error)
        return response.status(500).json({ message: 'fail to save validator bribe data' });
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

