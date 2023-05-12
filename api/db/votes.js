import { client } from './connect';
export default async function votes(request, response) {
  const { endpoint } = request.query;
  const { body } = request
  // const queryParamDecode = decodeURIComponent(queryParam);
  await client.db.collection('votes').insertOne({
    item: 'canvas',
    qty: 100,
    tags: ['cotton'],
    size: { h: 28, w: 35.5, uom: 'cm' }
  });
  try {
    const res = await fetch(url, settings, JSON.stringify(body));
    const data = await res.json();
    return response.status(200).json(data);
  } catch (error) {
    return response.status(500).json(error);
  }

}