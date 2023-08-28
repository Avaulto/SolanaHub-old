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

export default async function getValidatorBribe(request, response) {
    try {
        await client.connect();
        // Sort in descending order by timestamp field
        const sortOptions = {sort:{$natural:-1}}

        const getValidatorBribe = await client.db("CDv1").collection("validator-bribe").findOne({},sortOptions )
        return response.status(200).json(getValidatorBribe);
    } catch (error) {
        console.error(error)
        return response.status(500).json({ message: 'Fail to retrieve validator bribe data', error });
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }

}
