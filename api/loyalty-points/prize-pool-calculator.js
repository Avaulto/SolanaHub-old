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

// prize pool builder:
// get direct stake msol/bsol
// get vote direct stake mnde/blze
// calc convert rate from mnde & blze to SOL
// take 50% of direct stake rewards - example: 100 direct stake
// sum the rewards from those direct stake + blze/mnde rewards


export default async function getEstimatePrizePool(request, response) {

    const LAMPORTS_PER_SOL = 1000000000;
    const validatorVoteKey = '7K8DVxtNJGnMtUY1CQJT5jcs8sFGSZTDiG7kowvFpECh'
    const validatorPubKey = 'BFMufPp4wW276nFzB7FVHgtY8FTahzn53kxxJaNpPGu6'
    const solInflation = 0.075;
    const validatorFee = 0.05;
    const validatorRevenue = solInflation * validatorFee;
    const rebates = validatorRevenue * 0.5; // giving away 50% of validator rewards
    const year = 365;
    const distributeTime = 7; // every 7 days

    // steps to calc weekly prize pool:
    // 1 get direct stake amount from mariande & solblaze
    // 2 get direct stake from veMNDE & veBLZE
    // 3 extract the validator APY and calc the rewards rebates
    // 4 calc BLZE validator emissions
    // 5 convert it to SOL
    // 6 multiple by 7 days
    // 7 evaluate total stake
    // 8 figure the rebates APY 
    const totalValidatorRewardsFromMarinadePool = async () => {
        const marinadeHistoryRecord = (await (await fetch(`https://validators-api.marinade.finance/validators/score-breakdown?query_vote_account=${validatorVoteKey}`)).json());
        const score = marinadeHistoryRecord.score_breakdown
        const yearlyRebate = score.target_stake_vemnde + score.target_stake_msol;
        return yearlyRebate
    }
    const totalValidatorRewardsFromSolblzePool = async () => {
        const snapshot = (await (await fetch('https://stake.solblaze.org/api/v1/cls_boost?validator=7K8DVxtNJGnMtUY1CQJT5jcs8sFGSZTDiG7kowvFpECh')).json())
        const Validator_bSOL_DS = snapshot.applied_stakes
        let yearlyRebate = Object.keys(Validator_bSOL_DS).filter(s => Validator_bSOL_DS[s]).reduce(
            (accumulator, currentValue) => accumulator + Number(Validator_bSOL_DS[currentValue]),
            0
        ) * snapshot.boost.conversion;

        return yearlyRebate
    }

    const totalRebatesFromDirectStake = async () => {
        const marinadeRebate = await totalValidatorRewardsFromMarinadePool();
        const solblazeRebate = await totalValidatorRewardsFromSolblzePool();
        const totalDirectStake = marinadeRebate + solblazeRebate;
        const totalRebates = totalDirectStake * rebates
        const weeklyRewards = totalRebates / year * distributeTime;
        return weeklyRewards
    }
    const blzeBoostEmissions = async () => {
        const validatorScore = (await (await fetch('https://rewards.solblaze.org/api/v1/data')).json()).scores[validatorPubKey];
        const blzeAirdrop = (await (await fetch(`https://rewards.solblaze.org/api/v1/daily_rewards?score=${validatorScore}`)).json()).amount * distributeTime;
        const inputAmountInSmallestUnits = Math.round(Number(blzeAirdrop) * 10 ** 9)
        const blze_to_sol_emmistions = (await (await fetch(`https://quote-api.jup.ag/v6/quote?inputMint=BLZEEuZUBVqFhj8adcCFPJvPVCiCyVmh3hkJMrU8KuJA&outputMint=So11111111111111111111111111111111111111112&amount=${inputAmountInSmallestUnits}&slippageBps=1`)).json()).outAmount / LAMPORTS_PER_SOL;
        // console.log( blzeAirdrop, blze_to_sol_emmistions.outAmount / LAMPORTS_PER_SOL)
        return { blzeAirdrop, blze_to_sol_emmistions }
    }


    const weeklyRebates = async () => {
        try {
            const stakeRewardsWeeklyRebates = await totalRebatesFromDirectStake();
            const BLZEAirdropWeeklyRebates = await blzeBoostEmissions();
            const totalRebates = stakeRewardsWeeklyRebates + BLZEAirdropWeeklyRebates.blze_to_sol_emmistions
            const stakeBoost = { totalRebates, breakdown: { directStakeRebate: stakeRewardsWeeklyRebates, BLZEAirdrop: { BLZE_emmistion: BLZEAirdropWeeklyRebates.blzeAirdrop, BLZE_TO_SOL: BLZEAirdropWeeklyRebates.blze_to_sol_emmistions } } }
            return stakeBoost
        } catch (error) {

        }
    }


    try {
        const rebates = await weeklyRebates()
        return response.status(200).json(rebates);
    } catch (error) {
        return response.status(500).json({ message: 'Fail to retrieve validator bribe data', error });
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }

}
