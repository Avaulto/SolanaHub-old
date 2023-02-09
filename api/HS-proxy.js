import fetch from 'node-fetch';
export default async function HSproxy(request, response) {
    const {  endpoint } = request.query;
    const {body} = request
    // const queryParamDecode = decodeURIComponent(queryParam);
    const url = `https://beta.api.solanalysis.com/rest/${endpoint}`;
    const settings = {
        headers: { 
            'Content-Type': 'application/json',
            Authorization:  process.env.hyperspaceToken
        },
    }
    const res = await fetch(url, settings,body);
    const data = await res.json();
    return response.status(200).json( data );
}
