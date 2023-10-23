import { Component, OnInit } from '@angular/core';
import { SolendStoreService } from './solend-store.service';
import { Observable, of, shareReplay, switchMap } from 'rxjs';
import { Market } from './solend.model';
import { SolanaUtilsService } from 'src/app/services';
import { WalletExtended } from 'src/app/models';

@Component({
  selector: 'app-lend-borrow',
  templateUrl: './lend-borrow.page.html',
  styleUrls: ['./lend-borrow.page.scss'],
})
export class LendBorrowPage implements OnInit {
  constructor(
    private _solendStore:SolendStoreService,
     private _solanaUtilsService: SolanaUtilsService
     ) { }

  public solendStats = this._solendStore.getSolendStats().pipe(shareReplay())

  ngOnInit() {
  }
  async ionViewWillEnter(){
    await this._solendStore.initSolendSDK()
  }

}
