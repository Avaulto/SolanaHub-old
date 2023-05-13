const { MongoClient, ServerApiVersion } = require('mongodb');
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
  const { proposalId, signer } = request.body
  try {
      await client.connect();
      const db = client.db("CDv1")
      const collection = db.collection('proposals')
      const findOneQuery = { _id: proposalId };
      const proposal = await collection.findOne(findOneQuery);
      const alreadyVoted = proposal.signers.filter(inSigner => inSigner == signer);
      console.log('already voted:', alreadyVoted)
      if (alreadyVoted) {
          return res.json({ message: 'vote added' });
      }

      const updateOptions = { returnOriginal: false };
      let voteUpdate
      if (signer.voted == 'for') {
          voteUpdate = { for: proposal.for + 1, signers: proposal.signers.push(signer) }
      }
      if (signer.voted == 'against') {
          voteUpdate = { against: proposal.against + 1, signers: proposal.signers.push(signer) }
      }

      const updateDoc = {
          $set: voteUpdate
      };
      const updateResult = await collection.findOneAndUpdate(
          findOneQuery,
          updateDoc,
          updateOptions,
      );


      // const res = await fetch(url, settings, JSON.stringify(body));
      await res.json(updateResult.value);
      return response.status(200).json(res);
  } catch (error) {
      return response.status(500).json({ message: 'fail to vote', error });
  } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
  }


}
