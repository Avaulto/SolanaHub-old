import { Component, OnInit } from '@angular/core';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { NftStoreService } from 'src/app/services/nft-store.service';
import { filter, firstValueFrom, map, mergeMap, Observable, switchMap } from 'rxjs';
import { Nft, NFTGroup } from '../../models';
import { LoaderService, UtilsService } from 'src/app/services';



@Component({
  selector: 'app-nft-gallery',
  templateUrl: './nft-gallery.page.html',
  styleUrls: ['./nft-gallery.page.scss'],
})
export class NftGalleryPage implements OnInit {
  public nfts: Observable<Nft[]> = this._walletStore.anchorWallet$.pipe(
    switchMap(async wallet => {
      if (wallet) {
        return await this._nftStore.getAllOnwerNfts(wallet.publicKey.toBase58())
      } else {
        return null;
      }
    }))

  // public nfts: Observable<Nft[]> = this._walletStore.anchorWallet$.pipe(
  //   this.util.isNotNull,
  //   map(async wallet => {console.log(wallet), await this._nftStore.getAllOnwerNfts(wallet.publicKey.toBase58())}),
  //   switchMap(myNfts => this._nftStore.myNft$ )
  //   )
  // public nfts: Nft[] = []
  constructor(
    private _walletStore: WalletStore,
    private _nftStore: NftStoreService,
    public loaderService: LoaderService,
    private _utilsService: UtilsService
  ) { }

  async ngOnInit() {
    // const walletOwner = await (await firstValueFrom(this._walletStore.anchorWallet$)).publicKey;
    // this._nftStore.createNft()
    // this.nfts = await this._nftStore.getAllOnwerNfts(walletOwner.toBase58())
  }
  setSort(ev) {

  }

}
