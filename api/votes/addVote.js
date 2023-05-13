const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



export default async function addVote(request, response) {
  const { proposalId, voter } = request.body
  try {
      await client.connect();
      const findOneQuery= { _id: new ObjectId(proposalId) }
      const proposal = await client.db("CDv1").collection("proposals").findOne(findOneQuery)

      if (!proposal) {
        return response.status(400).json({ message: 'cant find proposal id' });
    }
    const alreadyVoted = proposal.signers.filter(inSigner => inSigner.voterPubkey == voter.voterPubkey);
    if (alreadyVoted.length) {
        return response.status(400).json({ message: 'already voted' });
    }
      const updateOptions = { returnOriginal: false };
      let voteUpdate
      const signers = proposal.signers
      signers.push(voter)
      if (voter.voted == 'for') {
          voteUpdate = { for: proposal.for + 1, signers }
      }
      if (voter.voted == 'against') {
          voteUpdate = { against: proposal.against + 1, signers }
      }

      const updateDoc = {
          $set: voteUpdate
      };
      const updateResult =  await client.db("CDv1").collection("proposals").findOneAndUpdate(
          findOneQuery,
          updateDoc,
          updateOptions,
      );
      return response.status(200).json(updateResult.value);
  } catch (error) {
      console.error(error)
      return response.status(500).json({ message: 'fail to vote', error });
  } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
  }

}
