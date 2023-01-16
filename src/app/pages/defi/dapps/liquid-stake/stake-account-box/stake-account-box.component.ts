import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { WalletConfig, WalletStore, Wallet } from '@heavy-duty/wallet-adapter';
import { Marinade, MarinadeConfig, Provider } from '@marinade.finance/marinade-ts-sdk'
import { MarinadeResult } from '@marinade.finance/marinade-ts-sdk/dist/src/marinade.types';
import { LAMPORTS_PER_SOL, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import bn from 'bn.js'
import { SolanaUtilsService, TxInterceptService, ToasterService, UtilsService } from 'src/app/services';
import { distinctUntilChanged, filter, firstValueFrom, map, Observable, switchMap, tap } from 'rxjs';
import { toastData, StakeAccountExtended, ValidatorData } from 'src/app/models';

import Plausible from 'plausible-tracker'
import { StakePoolProvider, StakePoolStats } from '../stake-pool.model';
import { depositSol, depositStake } from '@solana/spl-stake-pool';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
const { trackEvent } = Plausible();


@Component({
  selector: 'app-stake-account-box',
  templateUrl: './stake-account-box.component.html',
  styleUrls: ['./stake-account-box.component.scss'],
})
export class StakeAccountBoxComponent implements OnInit {
  @Input() selectedProvider: StakePoolProvider;
  @Input() stakePoolStats: StakePoolStats;
  @Input() marinade: Marinade;
  @Input() stakeAccounts: Observable<StakeAccountExtended[]>
  @Input() wallet;
  public stakeForm: FormGroup;
  formSubmitted: boolean = false;
  withCLS = false;
  public showAccountList: boolean = false;

  constructor(
    private _solanaUtilsService: SolanaUtilsService,
    private _txInterceptService: TxInterceptService,
    private _toasterService: ToasterService,
    private toasterService: ToasterService,
    private _fb: FormBuilder,
  ) { }


  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.stakeForm = this._fb.group({
      stakeAccount: ['', [Validators.required]]
    })
  }
  async ngOnChanges() {
    if (this.selectedProvider.name.toLowerCase() == 'marinade') {
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
    trackEvent('delegate stake account stake ' + this.selectedProvider.name)
    let { stakeAccount, validatorVoteAccount } = this.stakeForm.value;

    const stakeAccountPK = new PublicKey(stakeAccount.addr);

    try {
      if (this.selectedProvider.name.toLowerCase() == 'marinade') {
        const depositAccount: MarinadeResult.DepositStakeAccount = await this.marinade.depositStakeAccount(stakeAccountPK);
        const txIns: Transaction = depositAccount.transaction
        await this._txInterceptService.sendTx([txIns], this.wallet.publicKey);
      } else {
        if (validatorVoteAccount) {
          this.stakeCLS(stakeAccount, validatorVoteAccount)
        } else {
          const validator_vote_key = new PublicKey(stakeAccount.validatorData.vote_identity);
          let depositTx = await depositStake(
            this._solanaUtilsService.connection,
            this.selectedProvider.poolpubkey,
            this.wallet.publicKey,
            validator_vote_key,
            stakeAccountPK
          );
          await this._txInterceptService.sendTx(depositTx.instructions, this.wallet.publicKey, depositTx.signers);
        }

      }
    } catch (error) {

      const toasterMessage: toastData = {
        message: error.toString().substring(6),
        icon: 'alert-circle-outline',
        segmentClass: "merinadeErr"
      }
      this.toasterService.msg.next(toasterMessage)
    }
  }
  public async stakeCLS(stakeAccount:StakeAccountExtended, targetValidatorVoteAccount: string) {

    trackEvent('custom validator stake')
    // current validator whom delegated by stake account
    const currentValidator = new PublicKey(stakeAccount.validatorData.vote_identity);
    // target validator you wish to delegate
    const validator = new PublicKey(targetValidatorVoteAccount)

    const stakeAccountPK = new PublicKey(stakeAccount.addr);
    const wallet = this.wallet.publicKey;

    try {
      let depositTx = await depositStake(
        this._solanaUtilsService.connection,
        this.selectedProvider.poolpubkey,
        wallet,
        currentValidator,
        stakeAccountPK
      );
        console.log(depositTx)
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
}
