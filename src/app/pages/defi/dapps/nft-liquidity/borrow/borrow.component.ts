import { Component, Input, OnInit } from '@angular/core';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { Observable, switchMap } from 'rxjs';
import { SolanaUtilsService, UtilsService } from 'src/app/services';
import { FraktStoreService } from '../frakt-store.service';
import { BestBorrowSuggtion } from '../frakt.model';

@Component({
  selector: 'app-borrow',
  templateUrl: './borrow.component.html',
  styleUrls: ['./borrow.component.scss'],
})
export class BorrowComponent implements OnInit {
  @Input() wallet = null;
  constructor(private _fraktStoreService:FraktStoreService,private _solanaUtilsService:SolanaUtilsService, private _walletStore: WalletStore, private _utilsService:UtilsService) { }
  public collateralNfts: Observable<BestBorrowSuggtion> = this._walletStore.anchorWallet$.pipe(
    this._utilsService.isNotNull,
    this._utilsService.isNotUndefined,
    switchMap(wallet => {
      const collateralNfts = this._fraktStoreService.borrowSuggetion(wallet.publicKey.toBase58())
      return collateralNfts
    })
    )
  
  // this._fraktStoreService.borrowSuggetion(this.wallet.publicKey.toBase58())
  ngOnInit() {}

}
