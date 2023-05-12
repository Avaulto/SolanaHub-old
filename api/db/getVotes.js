import { client } from './connect';
export default async function votes(request, response) {
  const { endpoint } = request.query;
  const { body } = request
  try {
    const votes = db.collection('votes').find({ item: 'canvas' });
    return response.status(200).json(votes);
  } catch (error) {
    return response.status(500).json(error);
  }

}
