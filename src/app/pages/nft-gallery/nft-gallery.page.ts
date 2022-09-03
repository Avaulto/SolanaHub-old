import { Component, OnInit } from '@angular/core';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { NftStoreService } from 'src/app/services/nft-store.service';
import { firstValueFrom, Observable, switchMap } from 'rxjs';
import { Nft, NFTGroup } from '../../models';
import { LoaderService } from 'src/app/services';



@Component({
  selector: 'app-nft-gallery',
  templateUrl: './nft-gallery.page.html',
  styleUrls: ['./nft-gallery.page.scss'],
})
export class NftGalleryPage implements OnInit {
  public nfts: Observable<Nft[]> = this._walletStore.anchorWallet$.pipe(switchMap(async wallet => await this._nftStore.getAllOnwerNfts(wallet.publicKey.toBase58())))

  constructor(
    private _walletStore: WalletStore,
    private _nftStore: NftStoreService,
    public loaderService:LoaderService
  ) { }

  async ngOnInit() {
  }
  setSort(ev) {

  }

}
