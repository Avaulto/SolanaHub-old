import { client } from './connect';
export default async function votes(request, response) {
  const { endpoint } = request.query;
  const { body } = request
  // const queryParamDecode = decodeURIComponent(queryParam);
  await client.db.collection('votes').insertOne({
    uuid:"234534645",
    date: new Date(),
    category: "integration",
    title: "orca integration",
    desc: "This proposal will - Ratify the Constitution to be used by Marinade DAO - Ratify the Code of Conduct to be used by Marinade DAO - Confirm phase one of the migration to SPL governance, where multisigs and team powers are moved to Realms while MNDE voting stays on Tribeca until phase two.",
    ownerPK: "JPQmr9p2RF3X5TuBXxn6AGcEfcsHp4ehcmzE5Ys7pZD",
    for: 100,
    against: 15,
    status: "vote",
  });
  try {
    // const res = await fetch(url, settings, JSON.stringify(body));
    const data = await res.json({message:'vote added'});
    return response.status(200).json(data);
  } catch (error) {
    return response.status(500).json(error);
  }

}
