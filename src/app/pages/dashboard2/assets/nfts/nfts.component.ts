import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { IonicSlides, Platform } from '@ionic/angular';
import { PortfolioAssetCollectibleData } from '@sonarwatch/portfolio-core';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';
import { Nft } from 'src/app/models';
import { NftStoreService } from 'src/app/services';

@Component({
  selector: 'app-nfts',
  templateUrl: './nfts.component.html',
  styleUrls: ['./nfts.component.scss'],
})
export class NFTsComponent implements OnInit {
  swiperModules = [IonicSlides];
  @Input('NFTs') NFTs = null;
  private nfts: BehaviorSubject<Nft[]> = new BehaviorSubject<Nft[]>([]);
  public nfts$ = this.nfts.asObservable().pipe(distinctUntilChanged());
  constructor(
    private _nftStore: NftStoreService,
    public platform: Platform) { }



  async ngOnInit() {
    const nftExtractedData = this.NFTs.map((nft) => Object.assign(nft, nft.data))
    const updateNfts = this.nftsUpdate(nftExtractedData)
    this.nfts.next(updateNfts)

  //  const extraData = await this._nftStore.getnftMetaData(this.NFTs);
  //  let updateNfts2 = this.nftsUpdate(extraData)

  //  this.nfts.next(updateNfts2)
  }

  nftsUpdate(nfts) {
    const updateList = nfts.map((nft) => {
      return {
        collection: nft.collection?.name || '',
        collectionName: nft.collection?.name || '',
        mintAddress: nft.address,
        description: nft.description,
        name: nft.name,
        image: nft.imageUri || nft.image,
        // listStatus?: string;
        websiteURL: nft?.external_url || '',
        explorerURL: nft?.address || '',
        floorPrice: nft?.floorPrice || 0,
        attributes: nft?.attributes || [],
        symbol: nft?.symbol || '',
      }
    })
    return updateList
  }
}
