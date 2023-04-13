import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
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
  public selectedCollateral: BestBorrowSuggtion;
  public durationOptions: Observable<any[]> = null;
  showDurationDropDown = false;
  constructor(
    private _fraktStoreService: FraktStoreService,
    private _solanaUtilsService: SolanaUtilsService,
    public utilsService: UtilsService,
    private _fb: FormBuilder,
  ) { }
  public maxBorrow: number = 0;
  public collateralNfts$: Observable<BestBorrowSuggtion[]> = this._solanaUtilsService.walletExtended$.pipe(

    switchMap(async wallet => {
      // this.maxBorrow = await this._fraktStoreService.getMaxBorrow(wallet.publicKey.toBase58())
      if (wallet) {

        const collateralNfts = this._fraktStoreService.borrowSuggetion(wallet.publicKey.toBase58())
        return collateralNfts
      } else {
        return null
      }
    })
  )
  slideOpts = {
    initialSlide: 0,
    slidesPerView: 2.2,
    centeredSlides: false,
    spaceBetween: 15,
    speed: 400
  };
  setMaxAmount(maxAmount) {
    this.borrowForm.controls.amount.setValue(maxAmount);
  }
  // this._fraktStoreService.borrowSuggetion(this.wallet.publicKey.toBase58())
  ngOnInit() {
    this.borrowForm = this._fb.group({
      collateral: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      duration: ['', [Validators.required]]
    })

    this.borrowForm.valueChanges.subscribe(formValues => {
      console.log(formValues)
      if (formValues.loanType == 'time based') {
        this.loanInfo = {
          maxLoanValue: null,
          calcParms: {
            'floor price': null,
            'loan to value': null,
            'fee': null,
            'to repay': null
          }
        }
      }
    })
  }
  setSelectedDuration(duration: { extraData: { type: any }, name: string, value: any, selectable: boolean }) {
    this.borrowForm.controls['duration'].setValue(duration.value)
    this.showDurationDropDown = false
    this.selectedDuration = duration;
  }

  loanInfo = {
    maxLoanValue: null,
    calcParms: {
      'floor price': null,
      'loan to value': null,
      'fee': null,
      'to repay': null
    }

  }
  toggleBorrow(nft: BestBorrowSuggtion) {
    let tempDurationOptions = []
    this.borrowForm.reset()
    this.selectedDuration = null
    this.selectedCollateral == nft ? this.selectedCollateral = null : this.selectedCollateral = nft;
    if (this.selectedCollateral) {
      this.borrowForm.controls.collateral.setValue(this.selectedCollateral);

      if (this.selectedCollateral.classicParams.timeBased) {
        let days = this.selectedCollateral.classicParams.timeBased.returnPeriodDays
        tempDurationOptions.push({ extraData: { type: 'time based' }, name: `${days} days`, value: 'time_based', selectable: true })
      }
      if (this.selectedCollateral.classicParams.priceBased) {
        tempDurationOptions.push({ extraData: { type: 'price based' }, name: `Perpetual`, value: 'price_based', selectable: true })
      }

      this.durationOptions = of(tempDurationOptions)
    }
  }

  getMaxBorrow = () => {
    const { duration } = this.borrowForm.value;
    const collateral = this.selectedCollateral;
    if(duration){
      if (duration == 'price_based') {
        return Number(collateral.classicParams.maxLoanValue / LAMPORTS_PER_SOL).toFixedNoRounding(3)
      }
      if (duration == 'time_based') {
        return Number(collateral.classicParams.timeBased.loanValue / LAMPORTS_PER_SOL).toFixedNoRounding(3) 
      }
    }else{
      return 'select duration'
    }
  }
  async submitBorrowForm() {
    const { collateral, amount, duration } = this.borrowForm.value;
    const loanValue = amount * LAMPORTS_PER_SOL;
    console.log(duration)
    await this._fraktStoreService.borrowSolUsingNft(
      this._solanaUtilsService.getCurrentWallet().publicKey,
      collateral,
      loanValue,
      duration
    )
  }
}
