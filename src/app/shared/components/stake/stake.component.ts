import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LAMPORTS_PER_SOL, } from '@solana/web3.js';
import { firstValueFrom,  Observable, of, Subscriber, switchMap } from 'rxjs';
import { Asset, ValidatorData } from 'src/app/models';
import { LoaderService, TxInterceptService, SolanaUtilsService } from 'src/app/services';
import { ActivatedRoute } from '@angular/router';

import va from '@vercel/analytics';
import { StakePoolStoreService } from 'src/app/pages/defi/dapps/liquid-stake/stake-pool-store.service';
import {  BN } from '@marinade.finance/marinade-ts-sdk';

interface StakePool {
  logo: string,
  name: string,
  // apy: number,
}

@Component({
  selector: 'app-stake',
  templateUrl: './stake.component.html',
  styleUrls: ['./stake.component.scss'],
})
export class StakeComponent implements OnInit {
  public wallet$ = this._solanaUtilsService.walletExtended$;
  @Input() validatorsData: Observable<ValidatorData[] | ValidatorData>;
  @Input() avgApy: number;
  @Input() privateValidatorPage: boolean = false;

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
  private _selectedStakePool = null;
  constructor(
    public loaderService: LoaderService,
    private _fb: FormBuilder,
    private _solanaUtilsService: SolanaUtilsService,
    private _txInterceptService: TxInterceptService,
    private _activeRoute: ActivatedRoute,
    private _stakePoolStore: StakePoolStoreService
  ) { }
  async ngOnInit() {

    this.stakeForm = this._fb.group({
      amount: ['', [Validators.required]],
      voteAccount: ['', [Validators.required]],
      monthLockuptime: [0]
    })
    this.stakeForm.valueChanges.subscribe(form => {
      this.rewardInfo.amount = form.amount
    })

    const validatorData: any = await firstValueFrom(this.validatorsData);
    if (!this.privateValidatorPage) {
      this._activeRoute.queryParams
        .subscribe(params => {
          const validatorIdentity = params.validatorIdentity
          if (validatorIdentity) {
            this._preSelectValidator(validatorData, validatorIdentity);
          }
        }
        );
    } else {
      const myValidatorIdentity = validatorData.vote_identity
      validatorData.extraData['Support MEV'] = true;
      this._preSelectValidator([validatorData], myValidatorIdentity);
    }
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

  private async _preSelectValidator(validators: ValidatorData[], validatorVoteKey: string) {
    // const validatorsList: ValidatorData[] | any = await firstValueFrom(this.validatorsData);
    const getSelectedValidator = validators.filter(validator => validator.vote_identity == validatorVoteKey)[0];
    this.setSelectedValidator(getSelectedValidator);
  }

  public setSelectedValidator(validator: ValidatorData): void {
    this.rewardInfo.apy = validator.apy_estimate

    this.selectedValidator = validator;

    this.stakeForm.controls.voteAccount.setValue(validator.vote_identity);
  }

  // public setSelectedStakePool(pool: StakePool): void {


  //   this._selectedStakePool = pool;

  //   this.stakeForm.controls.sta.setValue(validator.vote_identity);
  // }


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
    await this._txInterceptService.delegate(amount * LAMPORTS_PER_SOL, walletOwnerPublicKey, voteAccount, monthLockuptime);
    va.track(`native stake with ${voteAccount}`);
  }
  private _getLockuptimeMilisecond(months: number): number {
    const lockupDateInSecond = new Date((new Date).setMonth((new Date).getMonth() + months)).getTime();
    const unixTime = Math.floor(lockupDateInSecond / 1000);
    return unixTime;
  }


  public stakingType: 'native' | 'liquid' = 'native'
  public selectStakePath(option: 'native' | 'liquid'): void {
    this.stakingType = option
    if (option === 'liquid') {
      this._addStakePoolControl()
    } else {
      this._removeStakePoolControl()
    }

  }
}
