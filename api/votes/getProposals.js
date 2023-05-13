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

export default async function getProposals(request, response) {
  try {
    const proposals = [];
    await client.connect();
    await client.db("CDv1").collection("proposals").find().forEach(item => proposals.push(item))
    return response.status(200).json(proposals);
} catch (error) {
    return response.status(500).json({ message: 'Fail to retrieve proposals', error });
} finally {
    // Ensures that the client will close when you finish/error
    await client.close();
}

}
