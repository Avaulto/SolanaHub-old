import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LAMPORTS_PER_SOL, } from '@solana/web3.js';
import { BehaviorSubject, firstValueFrom, map, Observable, of, shareReplay, Subject, Subscriber, switchMap, tap } from 'rxjs';
import { Asset, ValidatorData } from 'src/app/models';
import { LoaderService, TxInterceptService, SolanaUtilsService } from 'src/app/services';

import { StakePoolStoreService } from 'src/app/pages/defi/dapps/liquid-stake/stake-pool-store.service';
import { BN } from '@marinade.finance/marinade-ts-sdk';

interface StakePool {
  logo: string,
  name: string,
  // apy: number,
}

@Component({
  selector: 'app-stake-box',
  templateUrl: './stake-box.component.html',
  styleUrls: ['./stake-box.component.scss'],
})
export class StakeBoxComponent implements OnInit, OnChanges {
  @Input() privateValidatorPage: boolean = false;
  @Input() validatorsData: Observable<ValidatorData[] | ValidatorData | any> = null;

  public wallet$ = this._solanaUtilsService.walletExtended$;
  public avgApy$: BehaviorSubject<number> = new BehaviorSubject(0 as number)


  public showValidatorList: boolean = false;
  public stakeForm: FormGroup;
  public formSubmitted: boolean = false;

  public rewardInfo = {
    apy: 0,
    amount: 0
  }
  public selectedValidator: ValidatorData;
  public searchTerm = '';
  private _stakePools: StakePool[] = [{ name: 'Marinade', logo: 'assets/images/icons/mSOL-logo.png' }, { name: 'SolBlaze', logo: 'assets/images/icons/bSOL-logo.png' }]
  public stakePools$: Observable<StakePool[]> = of(this._stakePools)

  constructor(
    public loaderService: LoaderService,
    private _fb: FormBuilder,
    private _solanaUtilsService: SolanaUtilsService,
    private _txInterceptService: TxInterceptService,
    private _stakePoolStore: StakePoolStoreService
  ) { }
  async ngOnChanges(changes: SimpleChanges) {
  }
  async ngOnInit() {

    this.stakeForm = this._fb.group({
      amount: ['', [Validators.required]],
      voteAccount: ['', [Validators.required]],
      monthLockuptime: [0]
    })
    this.stakeForm.valueChanges.subscribe(form => {
      this.rewardInfo.amount = form.amount
    })
    if (this.privateValidatorPage) {
      this._preSelectValidator()
    }
    const getAvgAPY = await firstValueFrom(this._solanaUtilsService.getAvgApy())
    this.avgApy$.next(getAvgAPY)

  }

  private _addStakePoolControl() {
    const stakePoolControl = new FormControl('', Validators.required)
    this.stakeForm.addControl('stakePool', stakePoolControl)
  }
  private _removeStakePoolControl() {
    this.stakeForm.removeControl('stakePool')
  }
  public setMaxAmount(): void {
    const fixedAmount = this._solanaUtilsService.getCurrentWallet().balance - 0.0001
    this.stakeForm.controls.amount.setValue(fixedAmount.toFixedNoRounding(3));
  }

  private async _preSelectValidator() {
    const SolanaHubValidator: ValidatorData | any = await firstValueFrom(this.validatorsData);
    this.setSelectedValidator(SolanaHubValidator);

  }

  public setSelectedValidator(validator: ValidatorData): void {

    this.rewardInfo.apy = validator.apy_estimate

    this.selectedValidator = validator;

    this.stakeForm.controls.voteAccount.setValue(validator.vote_identity);

    this.avgApy$.next(this.selectedValidator.apy_estimate);

    
  }


  public async submitNewStake(): Promise<void> {

    let { amount, voteAccount, monthLockuptime, stakePool } = this.stakeForm.value;
    const walletOwner = this._solanaUtilsService.getCurrentWallet();
    if (this.stakingType === 'native') {
      await this._nativeStake(monthLockuptime, amount, walletOwner.publicKey, voteAccount);
    } else {
      await this._liquidStake(stakePool, amount, voteAccount)
    }

  }

  private async _liquidStake(poolName: string, amount, validatorVoteAccount) {
    const sol = new BN((amount - 0.001) * LAMPORTS_PER_SOL);
    this._stakePoolStore.stakeSOL(poolName.toLowerCase(), sol, validatorVoteAccount)
  }

  private async _nativeStake(monthLockuptime, amount, walletOwnerPublicKey, voteAccount) {
    if (monthLockuptime) {
      monthLockuptime = this._getLockuptimeMilisecond(monthLockuptime);
    }
    const record = {message:`native stake`, data:{ validator: voteAccount, amount }}
    await this._txInterceptService.delegate(amount * LAMPORTS_PER_SOL, walletOwnerPublicKey, voteAccount, monthLockuptime,record);
  
  }
  private _getLockuptimeMilisecond(months: number): number {
    const lockupDateInSecond = new Date((new Date).setMonth((new Date).getMonth() + months)).getTime();
    const unixTime = Math.floor(lockupDateInSecond / 1000);
    return unixTime;
  }


  public stakingType: 'native' | 'liquid' = 'native'
  public async selectStakePath(option: 'native' | 'liquid'): Promise<void> {
    this.stakingType = option
    if (option === 'liquid') {


      this._addStakePoolControl()
    } else {

      this._removeStakePoolControl()
    }
  }


}
