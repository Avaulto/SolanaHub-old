export default async function handler(request, response) {
    if (request.query.key !== 'pullData') {
      response.status(404).end();
      return;
    }
    try {
        // update validator bribe
        await fetch('https://dev.compact-defi.xyz/api/loyalty-points/update-validator-bribe?key=pullData')
        response.status(200).json({ success: 'validator bribe updated!' });
        
    } catch (error) {
        response.status(500).json({ message: 'fail to update validator bribe' });
    }

  }