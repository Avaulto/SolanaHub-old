import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { map, observable, Observable, Subscriber, switchMap } from 'rxjs';
import { Asset,ValidatorData } from 'src/app/models';
import { LoaderService, UtilsService, TxInterceptService, SolanaUtilsService } from 'src/app/services';


@Component({
  selector: 'app-stake',
  templateUrl: './stake.component.html',
  styleUrls: ['./stake.component.scss'],
})
export class StakeComponent implements OnInit {
  @Input() wallet: Asset;
  public validatorsData: Observable<ValidatorData[] | any> = this.solanaUtilsService.currentValidatorData
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
  selectedValidator: ValidatorData;
  searchTerm = '';

  constructor(
    public loaderService: LoaderService,
    private fb: FormBuilder,
    private solanaUtilsService: SolanaUtilsService,
    private txInterceptService: TxInterceptService,
    private utils: UtilsService
  ) { }
  ngOnInit() {
    this.stakeForm = this.fb.group({
      amount: ['', [Validators.required]],
      voteAccount: ['', [Validators.required]],
      monthLockuptime: [0]
    })
    this.stakeForm.valueChanges.subscribe(form => {
      this.rewardInfo.amount = form.amount
    })

  }
  setMaxAmount() {
    const fixedAmount = this.utils.shortenNum(this.wallet.balance - 0.0001)
    this.stakeForm.controls.amount.setValue(fixedAmount);
  }

  setSelectedValidator(validator: ValidatorData) {
    this.rewardInfo.apy = validator.apy_estimate

    this.selectedValidator = validator;
    this.showValidatorList = !this.showValidatorList

    this.stakeForm.controls.voteAccount.setValue(validator.vote_identity);
  }
  submitNewStake() {
    const { amount, voteAccount, monthLockuptime } = this.stakeForm.value;
    const walletOwnerPublicKey = this.wallet.publicKey;
    // const testnetvoteAccount = '87QuuzX6cCuWcKQUFZFm7vP9uJ72ayQD5nr6ycwWYWBG'
    const lockupTime = this.getLockuptimeMilisecond(monthLockuptime);

    this.txInterceptService.delegate(amount * LAMPORTS_PER_SOL, walletOwnerPublicKey, voteAccount, lockupTime)
  }
  getLockuptimeMilisecond(months: number) {
    const lockupDateInSecond = new Date((new Date).setMonth((new Date).getMonth() + months)).getTime();
    const unixTime = Math.floor(lockupDateInSecond / 1000);
    return unixTime;
  }
}
