import fetch from 'node-fetch';
export default async function MEproxy(request, response) {
    const { env, endpoint, queryParam } = request.query;
    const queryParamDecode = decodeURIComponent(queryParam);
    const url = `https://api-${env}.magiceden.dev/v2/${endpoint}?${queryParamDecode}`;
    const settings = {
        headers: { 
            'Content-Type': 'application/json',
            Authorization: "Bearer " + process.env.magicEdenToken
        },
    }
    const res = await fetch(url, settings);
    const data = await res.json();
    return response.status(200).json( data );
}
