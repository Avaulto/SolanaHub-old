import { Component, OnInit } from '@angular/core';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { NftStoreService } from 'src/app/services/nft-store.service';
import { switchMap } from 'rxjs';



@Component({
  selector: 'app-nft-gallery',
  templateUrl: './nft-gallery.page.html',
  styleUrls: ['./nft-gallery.page.scss'],
})
export class NftGalleryPage implements OnInit {
  public nftCollections = this._walletStore.anchorWallet$.pipe(switchMap(async wallet => await this._nftStore.getNftz2(wallet.publicKey.toBase58()))).subscribe()

  constructor(
    private _walletStore: WalletStore,
    private _nftStore: NftStoreService,
  ) { }

  ngOnInit() {
    // console.log('gallery loaded');
    // this._nftStore.getNftz()
    // // this.getAssosiateAccounts();
  }
  setSort(ev) {

  }



}
