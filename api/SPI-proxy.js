import fetch from 'node-fetch';
export default async function SPIproxy(request, response) {
  

    const url = `https://cogentcrypto.io/api/stakepoolinfo`;
    const settings = {
        headers: { 
            'Content-Type': 'application/json'
        },
    }
    try {
        const res = await fetch(url, settings);
        const data = await res.json();
        return response.status(200).json( data );
    } catch (error) {
        return response.status(500).json( error );
    }

}
