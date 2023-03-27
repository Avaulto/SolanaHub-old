import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { switchMap } from 'rxjs';
import { SolanaUtilsService, UtilsService } from 'src/app/services';
import { FraktStoreService } from '../../frakt-store.service';
@Component({
  selector: 'app-active-loans',
  templateUrl: './active-loans.component.html',
  styleUrls: ['./active-loans.component.scss'],
})
export class ActiveLoansComponent implements OnInit {
  @Output() onSelectTab = new EventEmitter();
  constructor(
    private _solanaUtilsService: SolanaUtilsService,
    private _utilsService: UtilsService,
    private _fraktStoreService: FraktStoreService
    ) { }
  public collateralNfts$ = this._solanaUtilsService.walletExtended$.pipe(
    switchMap(async wallet => {

      if(wallet){

        const collateralNfts =  this._fraktStoreService.borrowSuggetion(wallet.publicKey.toBase58())
        return collateralNfts
      }else{
        return null
      }
    })
  )
  public loanHoldingsByType ={
    flip: 0.02,
    perpetual: 0.1,
    onGrace: 0.7,
    bond: 1.2,
  }
  calcExpiry(unixTime: number) {
    return new Date(unixTime * 1000).toLocaleDateString() + ' ' + new Date(unixTime * 1000).toLocaleTimeString()
  }
  calcLoanTypes() {

  }
  ngOnInit() { }
  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1.3,
    centeredSlides: true,
    spaceBetween: 10,
    speed: 400
  };
}
