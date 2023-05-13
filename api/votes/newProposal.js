const express = require('express');
const app = express();

app.use(express.json({ extended: true, limit: '1mb' }))
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



export default async function newProposal(request, response) {
  const { proposal } = request.body
  try {
    await client.connect();
    const db = client.db("CDv1")
    const collection = db.collection('proposals')
    const newProposal = { ...proposal, for: 0, against: 0, date: new Date(), status: 'active', signers: [] }
    const newItem = await collection.insertOne(newProposal);
    return response.status(200).json(newItem);
  } catch (error) {
    console.warn(error)
    return response.status(500).json({ message: 'fail to create new proposal' });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }

}
