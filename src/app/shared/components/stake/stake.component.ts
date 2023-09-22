import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LAMPORTS_PER_SOL, } from '@solana/web3.js';
import { firstValueFrom,  map,  Observable, of, shareReplay, Subscriber, switchMap, tap } from 'rxjs';
import { Asset, ValidatorData } from 'src/app/models';
import { LoaderService, TxInterceptService, SolanaUtilsService } from 'src/app/services';
import { ActivatedRoute } from '@angular/router';

import va from '@vercel/analytics';
import { StakePoolStoreService } from 'src/app/pages/defi/dapps/liquid-stake/stake-pool-store.service';
import {  BN } from '@marinade.finance/marinade-ts-sdk';
import { PrizePool } from 'src/app/models/loyalty.model';
import { LoyaltyService } from 'src/app/loyalty/loyalty.service';

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
export class StakeComponent implements OnInit,OnChanges {
  public wallet$ = this._solanaUtilsService.walletExtended$;
  @Input() validatorsData: Observable<ValidatorData[] | ValidatorData | any>;
  @Input() avgApy: number = 0;
  @Input() privateValidatorPage: boolean = false;
  public loyaltyProgramBoost = 0;
  public showValidatorList: boolean = false;
  public stakeForm: FormGroup;
  public formSubmitted: boolean = false;
  private _marinadeNativeStrategy:ValidatorData = {
    name: 'Marinade Native',
    identity: 'stWirqFCf2Uts1JBL1Jsd3r6VBWhgnpdPxCTe1MFjrq',
    image:'assets/images/icons/marinade-native-logo.svg',
    vote_identity:'stWirqFCf2Uts1JBL1Jsd3r6VBWhgnpdPxCTe1MFjrq',
    website:'https://marinade.finance',
    wizScore: 100,
    commission: 0,
    apy_estimate: 7.47,
    activated_stake: 2000000, // https://api.marinade.finance/tlv
    uptime: 100,
    skipRate: 'none',
    selectable: true,
    extraData:  {
      'APY estimate': 7.47 + '%',
      commission:  + '%'
    }
  }
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
    private _loyaltyService:LoyaltyService,
    public loaderService: LoaderService,
    private _fb: FormBuilder,
    private _solanaUtilsService: SolanaUtilsService,
    private _txInterceptService: TxInterceptService,
    private _activeRoute: ActivatedRoute,
    private _stakePoolStore: StakePoolStoreService
  ) { }
  async ngOnChanges(changes: SimpleChanges) {
    if(this.avgApy){
      const loyaltyProgramApr =  await firstValueFrom(this._loyaltyService.getPrizePool())
      this.loyaltyProgramBoost = this.avgApy * loyaltyProgramApr.APR_boost / 100
    }

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

    const validatorData: any = await firstValueFrom(this.validatorsData);
    validatorData.unshift(this._marinadeNativeStrategy)
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


  public async submitNewStake(): Promise<void> {
    if(this.selectedValidator.name === 'Marinade Native'){
      this._marinadeNativeStake()
    }else{ 
      let { amount, voteAccount, monthLockuptime, stakePool } = this.stakeForm.value;
      const walletOwner = this._solanaUtilsService.getCurrentWallet();
      if (this.stakingType === 'native') {
        await this._nativeStake(monthLockuptime, amount, walletOwner.publicKey, voteAccount);
      } else {
        await this._liquidStake(stakePool, amount, voteAccount)
      }
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
  public async selectStakePath(option: 'native' | 'liquid'): Promise<void> {
    this.showValidatorList = false
    const validatorData: any = await firstValueFrom(this.validatorsData);
    console.log(validatorData)
    this.stakingType = option
    if (option === 'liquid') {
      validatorData.shift(this._marinadeNativeStrategy)
      this._addStakePoolControl()
    } else {
      validatorData.unshift(this._marinadeNativeStrategy)
      this._removeStakePoolControl()
    }
  }

  private _marinadeNativeStake(){
    let { amount } = this.stakeForm.value;
    const sol = new BN((amount - 0.001) * LAMPORTS_PER_SOL);
    this._stakePoolStore.marinadeNativeStake(sol)
  }
}
