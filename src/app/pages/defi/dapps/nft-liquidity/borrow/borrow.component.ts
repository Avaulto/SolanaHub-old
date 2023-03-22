import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, Observable, of, switchMap } from 'rxjs';
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
  @Input() searchTerm: string;
  public formSubmitted: boolean = false;
  public borrowForm: FormGroup;
  public selectedDuration;
  borrowDuration = of([{extraData: {duration: 7}, name: '7 days', value:7, selectable: true},{extraData: {duration: 14}, name: '14 days',value:14, selectable: true}])
  showDurationDropDown = false;
  constructor(
    private _fraktStoreService:FraktStoreService,
    private _solanaUtilsService:SolanaUtilsService, 
    private _utilsService:UtilsService,
    private _fb: FormBuilder,
    ) { }
    public maxBorrow: number = 0;
  public collateralNfts$: Observable<BestBorrowSuggtion[]> = this._solanaUtilsService.walletExtended$.pipe(
    this._utilsService.isNotNull,
    this._utilsService.isNotUndefined,
    switchMap(async wallet => {
      this.maxBorrow = await this._fraktStoreService.getMaxBorrow(wallet.publicKey.toBase58())
      const collateralNfts = this._fraktStoreService.borrowSuggetion(wallet.publicKey.toBase58())
      return collateralNfts
    })
    )
  
    setMaxAmount(){}
  // this._fraktStoreService.borrowSuggetion(this.wallet.publicKey.toBase58())
  ngOnInit() {
    this.borrowForm = this._fb.group({
      amount: ['', [Validators.required]],
      duration:['', [Validators.required]],
    })
  }
  setSelectedDuration(duration){
    this.borrowForm.controls['duration'].setValue(duration.value)
    this.showDurationDropDown = false
    this.selectedDuration = duration
  }
  submitBorrowForm(){

  }
}
