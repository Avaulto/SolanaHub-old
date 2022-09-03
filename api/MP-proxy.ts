import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";
import { Nft } from "src/app/models";
import { Connection, clusterApiUrl } from '@solana/web3.js';

export default async function GETAllOnwerNfts(request, response): Promise<Nft[]> {
  const { env, walletAdress } = request.query;
  const connection = new Connection(clusterApiUrl(env))
  const _metaplex = new Metaplex(connection)
  // const wallet =  await (await firstValueFrom(this._walletStore.anchorWallet$));
  // _metaplex.use(walletAdapterIdentity(wallet));
  const myNfts = await _metaplex
    .nfts()
    .findAllByOwner({ owner: new PublicKey(walletAdress) })
    .run();

  const myNftsExtended: Nft[] = await Promise.all(myNfts.map(async (metaPlexItem: any) => {
    try {
      const metaData = await this.getMetaData(metaPlexItem.uri);
      const nft: Nft = {
        name: metaPlexItem.name,
        image: metaData.image,
        description: metaData.description,
        mintAddress: metaPlexItem.address,
        collectionName: metaPlexItem.collection?.name,
        // price: 0,
        attributes: metaData.attributes,
        explorerURL: 'https://solscan.io/token/' + metaPlexItem.address,
        websiteURL: metaData.external_url,
        symbol: metaPlexItem.symbol
      }
      return nft
    } catch (error) {
      console.warn(error)
    }
  }))
  return response.status(200).json(myNftsExtended);
}