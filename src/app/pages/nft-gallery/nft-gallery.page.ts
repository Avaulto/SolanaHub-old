import { Component, OnInit } from '@angular/core';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { NftStoreService } from 'src/app/services/nft-store.service';
import { Observable, switchMap } from 'rxjs';
import { NFTGroup } from 'src/app/models';



@Component({
  selector: 'app-nft-gallery',
  templateUrl: './nft-gallery.page.html',
  styleUrls: ['./nft-gallery.page.scss'],
})
export class NftGalleryPage implements OnInit {
  public nftCollections: Observable<NFTGroup[]> = this._walletStore.anchorWallet$.pipe(switchMap(async wallet => await this._nftStore.getNftz(wallet.publicKey.toBase58())))

  constructor(
    private _walletStore: WalletStore,
    private _nftStore: NftStoreService,
  ) { }

  ngOnInit() {
  }
  setSort(ev) {

  }



}
