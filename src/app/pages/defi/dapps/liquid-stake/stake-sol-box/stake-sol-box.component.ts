import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { WalletConfig, WalletStore, Wallet } from '@heavy-duty/wallet-adapter';
import { Marinade, MarinadeConfig, Provider } from '@marinade.finance/marinade-ts-sdk'
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js';
import { SolanaUtilsService, ToasterService, TxInterceptService, UtilsService } from 'src/app/services';
import bn from 'bn.js'

import Plausible from 'plausible-tracker'
import { StakePoolProvider, StakePoolStats } from '../stake-pool.model';
import { depositSol, withdrawSol, withdrawStake } from '@solana/spl-stake-pool';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { toastData } from 'src/app/models';
const { trackEvent } = Plausible();


@Component({
  selector: 'app-stake-sol-box',
  templateUrl: './stake-sol-box.component.html',
  styleUrls: ['./stake-sol-box.component.scss'],
})
export class StakeSolBoxComponent implements OnInit, OnChanges {
  @Input() selectedProvider: StakePoolProvider;
  @Input() stakePoolStats: StakePoolStats;
  @Input() marinade: Marinade;
  @Input() solBalance: number = 0;
  @Input() wallet;
  public stakeForm: FormGroup;
  formSubmitted: boolean = false;
  withCLS = false;
  public segmentUtilTab: string = 'stake'

  public unStakeAmount;
  constructor(
    private _solanaUtilsService: SolanaUtilsService,
    private _txInterceptService: TxInterceptService,
    private _fb: FormBuilder,
    private _utilsService: UtilsService,
    private _toasterService: ToasterService
  ) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.stakeForm = this._fb.group({
      stakeAmount: ['', [Validators.required]]
    })
  }
  async ngOnChanges() {
    if (this.selectedProvider.name.toLowerCase() == 'marinade') {
      this.removeValidatorControl()
    }
  }
  setUtil(util: string) {
    this.segmentUtilTab = util;
  }
  setMaxAmountSOL() {
    this.stakeForm.controls.stakeAmount.setValue(this._utilsService.shortenNum(this.solBalance - 0.0001));
    // console.log(this.stakeAmount, this.solBalance)
  }
  setMaxAmountxSOL() {
    this.unStakeAmount = this.stakePoolStats.userHoldings.staked_asset
  }
  addValidatorControl() {
    this.withCLS = true;
    this.stakeForm.addControl('validatorVoteAccount', new FormControl('', Validators.required))
  }
  removeValidatorControl() {
    if(this.withCLS){
      this.withCLS = false;
      this.stakeForm.removeControl('validatorVoteAccount')
    }
  }
  setValidator(voteAccount) {
    this.stakeForm.controls['validatorVoteAccount'].setValue(voteAccount)
  }
  async liquidStake() {
    trackEvent('liquid stake')
    let { stakeAmount, validatorVoteAccount } = this.stakeForm.value;
    // const amount: number = Number(stakeAmount);
    const sol = new bn(stakeAmount * LAMPORTS_PER_SOL);
    if (this.selectedProvider.name.toLowerCase() == 'marinade') {
      const { transaction } = await this.marinade.deposit(sol);
      this._txInterceptService.sendTx([transaction], this.wallet.publicKey)
    } else {
      // custom stake to a validator using solblaze pool
      if (validatorVoteAccount) {
        this.stakeCLS(Number(sol));
      } else {

        let depositTx = await depositSol(
          this._solanaUtilsService.connection,
          this.selectedProvider.poolpubkey,
          this.wallet.publicKey,
          Number(sol)
        );
        this._txInterceptService.sendTx(depositTx.instructions, this.wallet.publicKey, depositTx.signers)
      }
    }

    // console.log(signature)
  }
  // stake custom validator
  public async stakeCLS(sol: number) {
    let { validatorVoteAccount } = this.stakeForm.value;
    trackEvent('custom validator stake')

    const validator = new PublicKey(validatorVoteAccount);

    const wallet = this.wallet.publicKey;

    try {
      let depositTx = await depositSol(
        this._solanaUtilsService.connection,
        this.selectedProvider.poolpubkey,
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
    } catch (error) {

      const toasterMessage: toastData = {
        message: error.toString().substring(6),
        icon: 'alert-circle-outline',
        segmentClass: "merinadeErr"
      }
      this._toasterService.msg.next(toasterMessage)
    }
  }
  public async liquidUnstake() {
    
    const sol = new bn(this.unStakeAmount * LAMPORTS_PER_SOL);
    if (this.selectedProvider.name.toLowerCase() == 'marinade') {
      const { transaction } = await this.marinade.liquidUnstake(sol)

      // sign and send the `transaction`
      this._txInterceptService.sendTx([transaction], this.wallet.publicKey)
    } else {
      let withdrawTx = await withdrawStake(
        this._solanaUtilsService.connection,
        this.selectedProvider.poolpubkey,
        this.wallet.publicKey,
        Number(this.unStakeAmount),
        false
      );
      this._txInterceptService.sendTx(withdrawTx.instructions, this.wallet.publicKey, withdrawTx.signers)

    }
  }
}
