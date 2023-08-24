import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

export default async  function getLeaderBoard(request, response){

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
      delegetors = await new Connection('https://solana-mainnet.rpc.extrnode.com').getProgramAccounts(new PublicKey('Stake11111111111111111111111111111111111111'), config)
    } catch (error) {
      console.warn(error);
    }
    return delegetors
  }