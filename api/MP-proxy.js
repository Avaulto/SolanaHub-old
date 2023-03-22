import { Metaplex } from "@metaplex-foundation/js";
import { PublicKey, Connection } from "@solana/web3.js";
import fetch from 'node-fetch';
export default async function MPproxy(request, response){
  const { env, walletAdress } = request.query;
  const cluster = env == 'devnet' ? 'https://api.devnet.solana.com' : 'https://solana-mainnet.rpc.extrnode.com'
  const connection = new Connection(cluster)
  const _metaplex = new Metaplex(connection);
  async function getMetaData(uri){
    let metaData = {}
    try {
      metaData = await (await fetch(uri)).json();
    } catch (error) {
      return metaData
    }
    return metaData
  }
  
    

  let myNftsExtended = []
  try {
    const myNfts = await _metaplex
    .nfts()
    .findAllByOwner({ owner: new PublicKey(walletAdress) })
    myNftsExtended = await Promise.all(myNfts.map(async (metaplexItem) => {
      try {
        const metaData = await getMetaData(metaplexItem.uri);
        const nft= {
          image: metaData.image,
          description: metaData.description,
          attributes: metaData.attributes,
          websiteURL: metaData.external_url,
          name: metaplexItem.name,
          mintAddress: metaplexItem?.mintAddress || metaplexItem.mint.address,
          collectionName: metaplexItem.collection?.name,
          explorerURL: metaplexItem.address,
          symbol: metaplexItem.symbol
        }
        return nft
      } catch (error) {
        console.warn(error)
        return {};
      }
    }))
  } catch (error) {
    console.error(error)
    return []
  }
  return response.status(200).json(myNftsExtended);
}
