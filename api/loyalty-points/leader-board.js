import { Connection, PublicKey } from "@solana/web3.js";

export default async function GetLeaderBoard(request, response) {
    const AvaultoVoteKey = '7K8DVxtNJGnMtUY1CQJT5jcs8sFGSZTDiG7kowvFpECh';
    async function _getMSOLDirectStake() {
        const snapshot = ((await fetch('https://snapshots-api.marinade.finance/v1/votes/msol/latest')).json()).snapshot
        const record = snapshot.records.find(vote => vote.validatorVoteAccount === AvaultoVoteKey)
        const AvaultoDS = record
        return AvaultoDS;
    }
    async function _getBSOLDirectStake() {
        const snapshot = ((await fetch('https://stake.solblaze.org/api/v1/cls_boost')).json()).snapshot
        const AvaultoDS = snapshot.applied_stakes[AvaultoVoteKey]
        return AvaultoDS;
    }
    async function _getMNDEVotes(){
        const mnde_votes = (await (await fetch('https://snapshots-api.marinade.finance/v1/votes/vemnde/latest')).json())
    }
    async function _getBLZEVotes(){
    }
    async function _getScore(){
        const mnde_votes = (await (await fetch('https://beta.compact-defi.xyz/api/loyalty-points/score-calculation')).json())
    }
    async function calcScore(){
        try {
            const loyaltyScore =  _getScore()
            const avaultoDelegators=  _getDelegetors();
            const mSOL_directStake =  _getMSOLDirectStake();
            const mnde_votes =  _getMNDEVotes();
            const bSOL_directStake =  _getBSOLDirectStake();
            const dataSet = await Promise.all({loyaltyScore,avaultoDelegators,mSOL_directStake,mnde_votes,bSOL_directStake})
            // const blze_votes = await _getMNDEVotes(); 
            // const leaderBoard = data
            console.log(dataSet)
        } catch (error) {
            
        }
    }
    try {
        
        return response.status(200).json(loyaltyScore);
    } catch (error) {
        console.error(error)
        return response.status(500).json(error);
    }
}
async function _getDelegetors() {
    let delegetors = []
    const AvaultoVoteKey = '7K8DVxtNJGnMtUY1CQJT5jcs8sFGSZTDiG7kowvFpECh';
    try {
        const config = {
            filters: [{
                // dataSize: 200,    //size of account (bytes)
                memcmp: {
                    offset: 124,     //location of our query in the account (bytes)
                    bytes: AvaultoVoteKey,  //our search criteria, a base58 encoded string
                }
            }]
        }
            ;
        delegetors = await new Connection('https://mb-avaulto-cc28.mainnet.rpcpool.com').getProgramAccounts(new PublicKey('Stake11111111111111111111111111111111111111'), config)
    } catch (error) {
        console.warn(error);
    }
    return delegetors
}