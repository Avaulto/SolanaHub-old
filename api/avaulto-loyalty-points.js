import fetch from 'node-fetch';
export default async function LoyaltyPoints(request, response) {
    const loyaltyScore = {
        native: 1,
        mSOL_DirectStake: null,
        bSOL_DirectStake: null,
        veMNDE_Boost: null,
        veBLZE_Boost: null
    }
    // const queryParamDecode = decodeURIComponent(queryParam);
    const url = `https://beta.api.solanalysis.com/rest/${endpoint}`;
    const settings = {
        headers: {
            'Authorization': process.env.hyperspaceToken,
            'Content-Type': 'application/json'
        },
    }

    const getDirectStakeRatio_mSOL = async () => {
        const totalPoolSize = await fetch('https://api.marinade.finance/tlv');
        this.snapshotCreatedAt = votes.voteRecordsCreatedAt
    
        const totalDirectStake = votes.records.filter(record => record.amount).reduce(
          (accumulator, currentValue) => accumulator + Number(currentValue.amount),
          0
        );
   

        const voteControlPoolSize = 0.2;
        // how much SOL the votes control
        const totalControl = poolSize * voteControlPoolSize;
        // how much % each stake control out of the total ds
        const singleStakeControlInPercentage = directStake / totalDirectStake
        // how much total SOL the validator will recive 
        const totalSOLForTheValidator = singleStakeControlInPercentage * totalControl;
        this.stakeRatio = (totalSOLForTheValidator / directStake)
    }
    const getVotesRatio_MNDE = () => {

    }
    const getDirectStakeRatio_bSOL = () => {

    }
    const getVotesRatio_BLZE = () => {

    }

    try {
        const res = await fetch(url, settings, JSON.stringify(body));
        const data = await res.json();
        return response.status(200).json(data);
    } catch (error) {
        return response.status(500).json(error);
    }



}
