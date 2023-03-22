import { Component, OnInit } from '@angular/core';

import { filter, firstValueFrom, map, mergeMap, Observable, shareReplay, Subscription, switchMap } from 'rxjs';
import { Nft, NFTGroup } from '../../models';
import { LoaderService, UtilsService, NftStoreService, DataAggregatorService, SolanaUtilsService } from 'src/app/services';



@Component({
  selector: 'app-nft-gallery',
  templateUrl: './nft-gallery.page.html',
  styleUrls: ['./nft-gallery.page.scss'],
})
export class NftGalleryPage {
  public nfts: Observable<Nft[]> = this._solanaUtilsService.walletExtended$.pipe(
    this._utilsService.isNotNull, 
    this._utilsService.isNotUndefined,
    switchMap(async wallet => {
      if (wallet) {
        const nfts = await this._nftStore.getAllOnwerNfts(wallet.publicKey.toBase58())
        const nftsPrices = nfts.map(nft => nft.floorPrice)
        this.evaluateTotalHolding(nftsPrices)
        return nfts
      } else {
        return null;
      }
    }),
    shareReplay(1))

  constructor(
    private _dataAggregator: DataAggregatorService,
    private _nftStore: NftStoreService,
    public loaderService: LoaderService,
    private _solanaUtilsService:SolanaUtilsService,
    private _utilsService: UtilsService
  ) { }
  allNft$: Subscription;
  public totalFloor:{sol:number,usd: number} = {sol:0,usd:0};
  async ionViewWillEnter() {

  }
  ionViewDidLeave() {
  }

  async evaluateTotalHolding(nftsPrices) {
    this.totalFloor.sol = this.calcTotalFloor(nftsPrices);
    const solPrice: number = await (await firstValueFrom(this._dataAggregator.getCoinData('solana'))).price.usd;
    this.totalFloor.usd = this.totalFloor.sol * solPrice
  }
  calcTotalFloor(nftsFloor) {
    const initialValue = 0;
    const totalValue = nftsFloor.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      initialValue
    );
    return totalValue;
  }
public openME(): void{
  window.open('https://magiceden.io/','_blank')
}
}
