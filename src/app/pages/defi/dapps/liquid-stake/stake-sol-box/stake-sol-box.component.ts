import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { LAMPORTS_PER_SOL, PublicKey, TransactionInstruction } from '@solana/web3.js';
import { SolanaUtilsService, ToasterService, TxInterceptService, UtilsService } from 'src/app/services';

import va from '@vercel/analytics';
import { StakePoolProvider, StakePoolStats } from '../stake-pool.model';
import { depositSol, withdrawStake } from '@solana/spl-stake-pool';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { toastData } from 'src/app/models';
import { TooltipPosition } from 'src/app/shared/layouts/tooltip/tooltip.enums';
import { StakePoolStoreService } from '../stake-pool-store.service';
import { environment } from 'src/environments/environment';
import {  BN } from '@marinade.finance/marinade-ts-sdk';
@Component({
  selector: 'app-stake-sol-box',
  templateUrl: './stake-sol-box.component.html',
  styleUrls: ['./stake-sol-box.component.scss'],
})
export class StakeSolBoxComponent implements OnInit, OnChanges {
  @Input() selectedProvider: StakePoolProvider = null;
  @Input() stakePoolStats: StakePoolStats;
  @Input() solBalance: number = 0;
  @Input() wallet;
  public supportDirectStake: boolean = false
  public tooltippos = TooltipPosition.LEFT
  public stakeForm: FormGroup;
  public formSubmitted: boolean = false;
  public withCLS = false;
  public menu: string[] = ['stake', 'unstake'];
  public currentTab: string = this.menu[0]

  public unStakeAmount;
  constructor(
    private _solanaUtilsService: SolanaUtilsService,
    private _txInterceptService: TxInterceptService,
    private _fb: FormBuilder,
    private _utilsService: UtilsService,
    private _toasterService: ToasterService,
    private _stakePoolStore: StakePoolStoreService
  ) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.stakeForm = this._fb.group({
      stakeAmount: ['', [Validators.required]]
    })
  }
  async ngOnChanges() {
    this.supportDirectStake = this.selectedProvider?.poolName === 'SolBlaze' || this.selectedProvider?.poolName === 'Marinade'
    if (!this.supportDirectStake) {
      this.removeValidatorControl()
    }

  }

  setMaxAmountSOL() {
    this.stakeForm.controls.stakeAmount.setValue(this._utilsService.shortenNum(this.solBalance - 0.001));
  }
  setMaxAmountxSOL() {
    this.unStakeAmount = this.stakePoolStats.userHoldings.staked_asset
  }
  addValidatorControl() {
    this.withCLS = true;
      this.stakeForm.addControl('validatorVoteAccount', new FormControl('', Validators.required))

  }
  removeValidatorControl() {
    if (this.withCLS) {
      this.withCLS = false;
      this.stakeForm.removeControl('validatorVoteAccount')
    }
  }
  setValidator(voteAccount) {
    this.stakeForm.controls['validatorVoteAccount'].setValue(voteAccount)
  }
  async liquidStake() {
    let referral = new PublicKey(environment.platformFeeCollector);
    let { stakeAmount, validatorVoteAccount } = this.stakeForm.value;
    const sol = new BN((stakeAmount - 0.001) * LAMPORTS_PER_SOL);
    this._stakePoolStore.stakeSOL(this.selectedProvider.poolName.toLowerCase(), sol, validatorVoteAccount)


  }
  // stake custom validator

 
  public async liquidUnstake() {

    const mSOL = new BN(this.unStakeAmount * LAMPORTS_PER_SOL);
    if (this.selectedProvider.poolName.toLowerCase() == 'marinade') {
      const { ticketAccountKeypair, transaction } = await this._stakePoolStore.marinadeSDK.orderUnstake(mSOL)

      // sign and send the `transaction`
      this._txInterceptService.sendTx([transaction], this.wallet.publicKey, [ticketAccountKeypair])
    } else {
      let withdrawTx = await withdrawStake(
        this._solanaUtilsService.connection,
        this.selectedProvider.poolPublicKey,
        this.wallet.publicKey,
        Number(this.unStakeAmount),
        false
      );
      await this._txInterceptService.sendTx(withdrawTx.instructions, this.wallet.publicKey, withdrawTx.signers)
      va.track('marinade delayed unstake', {amount:mSOL.toString() })
    }
  }
}
