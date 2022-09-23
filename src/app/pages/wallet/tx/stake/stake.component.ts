import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { lastValueFrom, map, observable, Observable, Subscriber, switchMap } from 'rxjs';
import { Asset,ValidatorData } from 'src/app/models';
import { LoaderService, UtilsService, TxInterceptService, SolanaUtilsService } from 'src/app/services';

import Plausible from 'plausible-tracker'
import { ActivatedRoute } from '@angular/router';
const { trackEvent } = Plausible();



@Component({
  selector: 'app-stake',
  templateUrl: './stake.component.html',
  styleUrls: ['./stake.component.scss'],
})
export class StakeComponent implements OnInit {
  @Input() wallet: Asset;

  public validatorsData: Observable<ValidatorData[] | any> = this._solanaUtilsService.currentValidatorData
    .pipe(map((validators) => {
      const validatorsExtended = validators.map((validator: ValidatorData) => {
        return {
          name: validator.name,
          vote_identity: validator.vote_identity,
          image: validator.image,
          selectable: true,
          apy_estimate: validator.apy_estimate,
          extraData: { 'APY estimate': validator.apy_estimate + '%', commission: validator.commission + '%' }
        }
      })
      return validatorsExtended
    }))
  @Input() avgApy: number;
  public showValidatorList: boolean = false;
  public stakeForm: FormGroup;
  public formSubmitted: boolean = false;
  public rewardInfo = {
    apy: 0,
    amount: 0
  }
  public selectedValidator: ValidatorData;
  public searchTerm = '';

  constructor(
    public loaderService: LoaderService,
    private _fb: FormBuilder,
    private _solanaUtilsService: SolanaUtilsService,
    private _txInterceptService: TxInterceptService,
    private _utilsService: UtilsService,
    private _route: ActivatedRoute
  ) { }
  ngOnInit() {
    this._route.queryParams
    .subscribe(params => {
      const validatorIdentity = params.validatorIdentity
      if(validatorIdentity){
        this._preSelectValidator(validatorIdentity);
      }
    }
  );

    this.stakeForm = this._fb.group({
      amount: ['', [Validators.required]],
      voteAccount: ['', [Validators.required]],
      monthLockuptime: [0]
    })
    this.stakeForm.valueChanges.subscribe(form => {
      this.rewardInfo.amount = form.amount
    })

  }
  public setMaxAmount():void {
    const fixedAmount = this._utilsService.shortenNum(this.wallet.balance - 0.0001)
    this.stakeForm.controls.amount.setValue(fixedAmount);
  }

  private async _preSelectValidator(validatorVoteKey:string){
    const validatorsList = await lastValueFrom(this._solanaUtilsService.getValidatorData());
    const getSelectedValidator = validatorsList.filter(validator => validator.vote_identity == validatorVoteKey)[0];
   this.selectedValidator  = getSelectedValidator;
  }

  public setSelectedValidator(validator: ValidatorData):void {
    this.rewardInfo.apy = validator.apy_estimate

    this.selectedValidator = validator;

    this.stakeForm.controls.voteAccount.setValue(validator.vote_identity);
  }
  public submitNewStake():void {
    trackEvent('regular stake')

    const { amount, voteAccount, monthLockuptime } = this.stakeForm.value;
    const walletOwnerPublicKey = this.wallet.publicKey;
    // const testnetvoteAccount = '87QuuzX6cCuWcKQUFZFm7vP9uJ72ayQD5nr6ycwWYWBG'
    const lockupTime = this._getLockuptimeMilisecond(monthLockuptime);

    this._txInterceptService.delegate(amount * LAMPORTS_PER_SOL, walletOwnerPublicKey, voteAccount, lockupTime)
  }
  private _getLockuptimeMilisecond(months: number): number {
    const lockupDateInSecond = new Date((new Date).setMonth((new Date).getMonth() + months)).getTime();
    const unixTime = Math.floor(lockupDateInSecond / 1000);
    return unixTime;
  }
}
