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

export default async function votes(request, response) {
  try {
    const votes = client.db('CDv1').collection('votes')
    return response.status(200).json(votes);
  } catch (error) {
    return response.status(500).json(error);
  }finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }

}
