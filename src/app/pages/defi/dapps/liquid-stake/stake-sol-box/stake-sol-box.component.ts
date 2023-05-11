import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { LAMPORTS_PER_SOL, PublicKey,  TransactionInstruction } from '@solana/web3.js';
import { SolanaUtilsService, ToasterService, TxInterceptService, UtilsService } from 'src/app/services';
import bn from 'bn.js'

import { StakePoolProvider, StakePoolStats } from '../stake-pool.model';
import { depositSol, withdrawStake } from '@solana/spl-stake-pool';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { toastData } from 'src/app/models';
import { TooltipPosition } from 'src/app/shared/components/tooltip/tooltip.enums';
import { StakePoolStoreService } from '../stake-pool-store.service';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-stake-sol-box',
  templateUrl: './stake-sol-box.component.html',
  styleUrls: ['./stake-sol-box.component.scss'],
})
export class StakeSolBoxComponent implements OnInit, OnChanges {
  @Input() selectedProvider: StakePoolProvider;
  @Input() stakePoolStats: StakePoolStats;
  @Input() solBalance: number = 0;
  @Input() wallet;
  tooltippos = TooltipPosition.LEFT
  public stakeForm: FormGroup;
  formSubmitted: boolean = false;
  withCLS = false;
  public menu: string[] = ['stake', 'unstake'];
  public currentTab: string = this.menu[0]

  public unStakeAmount;
  constructor(
    private _solanaUtilsService: SolanaUtilsService,
    private _txInterceptService: TxInterceptService,
    private _fb: FormBuilder,
    private _utilsService: UtilsService,
    private _toasterService: ToasterService,
    private _stakePoolStore: StakePoolStoreService,
    private $gaService: GoogleAnalyticsService
  ) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.stakeForm = this._fb.group({
      stakeAmount: ['', [Validators.required]]
    })
  }
  async ngOnChanges() {
    if (this.selectedProvider.poolName.toLowerCase() != 'solblaze') {
      this.removeValidatorControl()
    }
  }

  setMaxAmountSOL() {
    this.stakeForm.controls.stakeAmount.setValue(this._utilsService.shortenNum(this.solBalance -  0.001));
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
    const sol = new bn((stakeAmount - 0.001) * LAMPORTS_PER_SOL);
    if (this.selectedProvider.poolName.toLowerCase() == 'marinade') {
      const { transaction } = await this._stakePoolStore.marinadeSDK.deposit(sol);
      this._txInterceptService.sendTx([transaction], this.wallet.publicKey)
    } else {
      // custom stake to a validator using solblaze pool
      if (validatorVoteAccount) {
        this.stakeCLS(Number(sol));
      } else {
        
        let depositTx = await depositSol(
          this._solanaUtilsService.connection,
          this.selectedProvider.poolPublicKey,
          this.wallet.publicKey,
          Number(sol),
          undefined,
          // referral
        );
        await this._txInterceptService.sendTx(depositTx.instructions, this.wallet.publicKey, depositTx.signers)
        this.$gaService.event('liquid staking', 'stake', 'stake SOL');
      }
    }

  }
  // stake custom validator
  public async stakeCLS(sol: number) {
    let { validatorVoteAccount } = this.stakeForm.value;

    const validator = new PublicKey(validatorVoteAccount);

    const wallet = this.wallet.publicKey;

    try {
      let depositTx = await depositSol(
        this._solanaUtilsService.connection,
        this.selectedProvider.poolPublicKey,
        wallet,
        sol
      );

      let memo = JSON.stringify({
        type: "cls/validator_stake/lamports",
        value: {
          validator
        }
      });
      let memoInstruction = new TransactionInstruction({
        keys: [{
          pubkey: wallet,
          isSigner: true,
          isWritable: true
        }],
        programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
        data: (new TextEncoder()).encode(memo) as Buffer
      })

      const txId = await this._txInterceptService.sendTx([...depositTx.instructions, memoInstruction], this.wallet.publicKey, depositTx.signers);
      await fetch(`https://stake.solblaze.org/api/v1/cls_stake?validator=${validator}&txid=${txId}`);

      this.$gaService.event('liquid staking', 'custom validator stake SOL', validatorVoteAccount);
    } catch (error) {

      const toasterMessage: toastData = {
        message: error.toString().substring(6),
        segmentClass: "merinadeErr"
      }
      this._toasterService.msg.next(toasterMessage)
    }
  }
  public async liquidUnstake() {

    const sol = new bn(this.unStakeAmount * LAMPORTS_PER_SOL);
    if (this.selectedProvider.poolName.toLowerCase() == 'marinade') {
      const { transaction } = await this._stakePoolStore.marinadeSDK.liquidUnstake(sol)

      // sign and send the `transaction`
      this._txInterceptService.sendTx([transaction], this.wallet.publicKey)
    } else {
      let withdrawTx = await withdrawStake(
        this._solanaUtilsService.connection,
        this.selectedProvider.poolPublicKey,
        this.wallet.publicKey,
        Number(this.unStakeAmount),
        false
      );
      this._txInterceptService.sendTx(withdrawTx.instructions, this.wallet.publicKey, withdrawTx.signers)

    }
  }
}
