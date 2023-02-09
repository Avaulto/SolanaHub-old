import fetch from 'node-fetch';
export default async function HSproxy(request, response) {
    const {  endpoint } = request.query;
    const {body} = request
    // const queryParamDecode = decodeURIComponent(queryParam);
    const url = `https://beta.api.solanalysis.com/rest/${endpoint}`;
    const settings = {
        headers: { 
            'Authorization':  process.env.hyperspaceToken,
            'Content-Type': 'application/json'
        },
    }
    try {
        const res = await fetch(url, settings,JSON.stringify(body));
        const data = await res.json();
        return response.status(200).json( data );
    } catch (error) {
        return response.status(500).json( error );
    }

}
