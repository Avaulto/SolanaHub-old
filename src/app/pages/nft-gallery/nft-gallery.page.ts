import { Component, OnInit } from '@angular/core';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { NftStoreService } from 'src/app/services/nft-store.service';
import { firstValueFrom, mergeMap, Observable, switchMap } from 'rxjs';
import { Nft, NFTGroup } from '../../models';
import { LoaderService, UtilsService } from 'src/app/services';



@Component({
  selector: 'app-nft-gallery',
  templateUrl: './nft-gallery.page.html',
  styleUrls: ['./nft-gallery.page.scss'],
})
export class NftGalleryPage implements OnInit {
  public nfts: Observable<Nft[]> = this._nftStore.myNft$;
  // private walletOwner = this._walletStore.
  constructor(
    private _walletStore: WalletStore,
    private _nftStore: NftStoreService,
    public loaderService:LoaderService
  ) { }
  
  async ngOnInit() {
    const walletOwner = await (await firstValueFrom(this._walletStore.anchorWallet$)).publicKey;

    await this._nftStore.getAllOnwerNfts(walletOwner.toBase58())
  }
  setSort(ev) {

  }
}
