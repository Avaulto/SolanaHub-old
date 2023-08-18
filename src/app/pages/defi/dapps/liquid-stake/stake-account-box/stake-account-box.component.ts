import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { MarinadeResult } from '@marinade.finance/marinade-ts-sdk/dist/src/marinade.types';
import {  PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import { SolanaUtilsService, TxInterceptService, ToasterService, UtilsService } from 'src/app/services';
import {  Observable} from 'rxjs';
import { toastData, StakeAccountExtended } from 'src/app/models';


import { StakePoolProvider, StakePoolStats } from '../stake-pool.model';
import { depositSol, depositStake } from '@solana/spl-stake-pool';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { StakePoolStoreService } from '../stake-pool-store.service';
import va from '@vercel/analytics';
 

@Component({
  selector: 'app-stake-account-box',
  templateUrl: './stake-account-box.component.html',
  styleUrls: ['./stake-account-box.component.scss'],
})
export class StakeAccountBoxComponent implements OnInit {
  @Input() selectedProvider: StakePoolProvider = null;
  @Input() stakePoolStats: StakePoolStats;
  @Input() stakeAccounts: Observable<StakeAccountExtended[]>
  @Input() wallet;
  public supportDirectStake: boolean = false
  public stakeForm: FormGroup;
  public formSubmitted: boolean = false;
  public withCLS = false;
  public showAccountList: boolean = false;

  constructor(
    private _solanaUtilsService: SolanaUtilsService,
    private _txInterceptService: TxInterceptService,
    private _toasterService: ToasterService,
    private _fb: FormBuilder,
    private _stakePoolStore: StakePoolStoreService
  ) { }


  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.stakeForm = this._fb.group({
      stakeAccount: ['', [Validators.required]]
    })
  }
  async ngOnChanges() {
    this.supportDirectStake = this.selectedProvider?.poolName === 'SolBlaze' || this.selectedProvider?.poolName === 'Marinade'
    if (!this.supportDirectStake) {
      this.removeValidatorControl()
    }
  }
  setSelectedStakeAccount(stakeAccount: StakeAccountExtended) {
    this.stakeForm.controls['stakeAccount'].setValue(stakeAccount)
    this.showAccountList = !this.showAccountList
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
  async delegateStakeAccount() {

    let { stakeAccount, validatorVoteAccount } = this.stakeForm.value;

    const stakeAccountPK = new PublicKey(stakeAccount.addr);

    try {
      if (this.selectedProvider.poolName.toLowerCase() == 'marinade') {
        const depositAccount: MarinadeResult.DepositStakeAccount = await  this._stakePoolStore.marinadeSDK.depositStakeAccount(stakeAccountPK,{directToValidatorVoteAddress:validatorVoteAccount});
        const txIns: Transaction = depositAccount.transaction
        await this._txInterceptService.sendTx([txIns], this.wallet.publicKey);
      } else {
        const validator_vote_key = new PublicKey(stakeAccount.validatorData.vote_identity);
        let depositTx = await depositStake(
          this._solanaUtilsService.connection,
          this.selectedProvider.poolPublicKey,
          this.wallet.publicKey,
          validator_vote_key,
          stakeAccountPK
        );
        if (validatorVoteAccount) {
          this.stakeCLS(depositTx, validatorVoteAccount)
        } else {
   
          await this._txInterceptService.sendTx(depositTx.instructions, this.wallet.publicKey, depositTx.signers);
          va.track('liquid staking', { type: 'stake account' });
        }

      }
    } catch (error) {
      const toasterMessage: toastData = {
        message: error.toString().substring(6),
        segmentClass: "merinadeErr"
      }
      this._toasterService.msg.next(toasterMessage)
    }
  }
  // stake custom validator
  public async stakeCLS(txs, validatorVoteAccount: string) {

    const validator = new PublicKey(validatorVoteAccount);

    const wallet = this.wallet.publicKey;

    try {
   

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

      const txId = await this._txInterceptService.sendTx([txs, memoInstruction], this.wallet.publicKey, txs.signers);
      await fetch(`https://stake.solblaze.org/api/v1/cls_stake?validator=${validator}&txid=${txId}`);
      va.track('liquid staking', { type: `custom validator stake SOL ${validatorVoteAccount} using account` });
    } catch (error) {
      console.log(error)
      const toasterMessage: toastData = {
        message: error.toString().substring(6),
        segmentClass: "merinadeErr"
      }
      this._toasterService.msg.next(toasterMessage)
    }
  }
}
