import fetch from 'node-fetch';
export default async function MEproxy(request, response) {
    console.log(request)
    const { env, endpoint, httpMethod, queryParam, body } = request.query;
    const url = `https://api-${env}.magiceden.dev/v2${endpoint}${queryParam}`
    const settings = {
        method: httpMethod,
        headers: { 'Content-Type': 'application/json' },
    }
    if (httpMethod == 'body') {
        body
    }
    const res = await fetch(url, settings);
    const data = await res.json();
    return response.status(200).json( data );
}
