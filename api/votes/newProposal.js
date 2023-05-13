const express = require('express');
const app = express();

app.use(express.json({extended: true, limit: '1mb'}))
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
  const { endpoint } = request.query;
  const { proposal } = request.body
  console.log(proposal,request.body)
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // const queryParamDecode = decodeURIComponent(queryParam);
    const db = client.db("CDv1")
    const collection = db.collection('proposals')
    const newProposal = {...proposal,for:1,against:0, date: new Date(), signers:[] }
    const newItem = await collection.insertOne(newProposal);
    // const res = await fetch(url, settings, JSON.stringify(body));
    // const data = await res.json({ message: 'vote added' });
    return response.status(200).json(newItem);
  } catch (error) {
    console.warn(error)
    return response.status(500).json({message: 'fail to create new proposal'});
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }

}
