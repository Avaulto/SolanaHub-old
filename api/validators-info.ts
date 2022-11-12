import fetch from 'node-fetch';
export default async function ValidatorData(request, response) {
    const { env, validator, queryParam } = request.query;
    const queryParamDecode = decodeURIComponent(queryParam);
    const url = `https://www.validators.app/api/v1/validators/${env}${validator}?${queryParamDecode}`;
    const settings = {
        headers: { 
            Token: process.env.validators_app
        },
    }
    const res = await fetch(url, settings);
    const data = await res.json();
    return response.status(200).json( data );
}
