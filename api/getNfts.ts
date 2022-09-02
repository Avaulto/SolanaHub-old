import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";
import { Nft } from "src/app/models";

export default async function getNftz(wallet): Promise<Nft[]> {
    const _metaplex = new Metaplex(this._solanaUtilsService.connection)
    // const wallet =  await (await firstValueFrom(this._walletStore.anchorWallet$));
    // _metaplex.use(walletAdapterIdentity(wallet));
    const myNfts = await this._metaplex
    .nfts()
    .findAllByOwner({ owner: new PublicKey(wallet) })
    .run();

    console.log(myNfts)
    const myNftsExtended: Nft[] = await Promise.all(myNfts.map(async (metaPlexItem:any) => {
      try {
        const metaData = await this.getMetaData(metaPlexItem.uri);
        console.log(metaData)
        const nft: Nft = {
          name: metaPlexItem.name,
          image: metaData.image,
          description: metaData.description,
          mintAddress: metaPlexItem?.mintAddress,
          collectionName: metaPlexItem.collection?.name,
          // price: 0,
          attributes: metaData.attributes,
          explorerURL: 'https://solscan.io/token/' + metaPlexItem.address,
          websiteURL: metaData.external_url,
          symbol: metaPlexItem.symbol
        }
        // if (nftMapper[nft.symbol]) {
        //   nftMapper[nft.symbol].push(nft);
        // } else {
        //   nftMapper[nft.symbol] = [];
        //   nftMapper[nft.symbol].push(nft);
        // }
        return nft
      } catch (error) {
        console.warn(error)
      }
    }))
    console.log(myNftsExtended)
    return myNftsExtended;
    // for (const iterator in nftMapper) {
    //   const nftGroup: Nft[] = nftMapper[iterator];
    //   const collection = await this.getCollectionData(nftGroup[0].mint)
    //   collection.NFTs = nftGroup;
    //   collections.push(collection)
    // }
    // return collections


  }