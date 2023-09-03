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


export default async function getValidatorBribe(request, response) {
    try {
     
        return response.status(200).json(latest);
    } catch (error) {
        return response.status(500).json({ message: 'Fail to retrieve validator bribe data', error });
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }

}
