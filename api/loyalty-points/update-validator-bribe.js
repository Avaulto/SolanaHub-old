import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { MongoClient, ServerApiVersion } from 'mongodb';
const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export default async function UpdateValidatorBribe(request, response) {

    const validatorVoteKey='7K8DVxtNJGnMtUY1CQJT5jcs8sFGSZTDiG7kowvFpECh'
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

    // steps to calc
    // 1. fetch all delegators
    // 2. look up stakers from various staking options by wallet owner
    // 3. gather all info into one object
    // 4. evaluate how much score each property is worth
    // 5. combine all the scores
    // 6. add multipliers
    // return the score & break down
    async function validatorBribeData() {
        try {
            const [delegetors, Validator_mSOL_DS, Validator_mSOL_Votes, Validator_bSOL_DS] = await Promise.all([
                _getNativeDelegetors(),
                _getValidatorMSOLDirectStake(),
                _getValidatorMNDEVotes(),
                _getValidatorBSOLDirectStake(),
            ]);



            const validatorsBribe = delegetors.map(staker => {
                const mSOL_directStake = Validator_mSOL_DS.find(ds => ds.tokenOwner === staker.walletOwner)?.amount || 0;
                const mSOL_votePower = Validator_mSOL_Votes.find(ds => ds.tokenOwner === staker.walletOwner)?.amount || 0;
                const bSOL_directStake = Number(Validator_bSOL_DS[staker.walletOwner]) || 0;

                const nativeStake = { amount: staker.amount, ageInEpochs: staker.ageInEpochs, account: staker.account }
                return { walletOwner: staker.walletOwner, nativeStake, mSOL_directStake, mSOL_votePower, bSOL_directStake }
            })

            return validatorsBribe
        } catch (error) {
            console.log(error)
        }
    }
    async function storeValidatorBribe(storeRecord) {
        await client.connect();
        const db = client.db("CDv1")
        const collection = db.collection('validator-bribe')
        await collection.insertOne(storeRecord);
        return true
    }
    try {
        const validatorsBribe = await validatorBribeData()
        await storeValidatorBribe(validatorsBribe)
        return response.status(200).json({ message: 'saved!' });
    } catch (error) {
        console.warn(error)
        return response.status(500).json({ message: 'fail to save validator bribe data' });
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

