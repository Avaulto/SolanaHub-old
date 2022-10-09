import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";
import { Nft } from "src/app/models";
import { Connection, clusterApiUrl } from '@solana/web3.js';

export default async function GETAllOnwerNfts(request, response): Promise<Nft[]> {
  const { env, walletAdress } = request.query;
  const connection = new Connection(clusterApiUrl(env))
  const _metaplex = new Metaplex(connection);
  async function getMetaData(uri: string): Promise<any> {
    let metaData: any = {}
    try {
      metaData = await (await fetch(uri)).json();
      // metaDataRes = await metaDataReq.json();
    } catch (error) {
      // console.error(error)
      return metaData
    }
    return metaData
  }
  // const wallet =  await (await firstValueFrom(this._walletStore.anchorWallet$));
  // _metaplex.use(walletAdapterIdentity(wallet));
  const myNfts = await _metaplex
    .nfts()
    .findAllByOwner({ owner: new PublicKey(walletAdress) })
    .run();

  const myNftsExtended: Nft[] = await Promise.all(myNfts.map(async (metaplexItem: any) => {
    try {
      const metaData = await getMetaData(metaplexItem.uri);
      const nft: Nft = {
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
      return {} as Nft;
      console.warn(error)
    }
  }))
  return response.status(200).json(myNftsExtended);
}
