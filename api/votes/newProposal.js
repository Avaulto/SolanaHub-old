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
  const { endpoint } = request.query;
  const { proposal } = request.body
  try {
    console.dir(proposal)
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // const queryParamDecode = decodeURIComponent(queryParam);
    const db = await client.db("CDv1")
    const collection = db.collection('votes')
    const newProposal = {...proposal,for:1,agains:0, date: new Date().now(), signers:[] }
    const newItem = await collection.insertOne(newProposal);
    // const res = await fetch(url, settings, JSON.stringify(body));
    // const data = await res.json({ message: 'vote added' });
    return response.status(200).json(newItem);
  } catch (error) {
    console.warn(error)
    return response.status(500).json(error);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }

}
