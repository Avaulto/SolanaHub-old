import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LAMPORTS_PER_SOL, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import Plausible from 'plausible-tracker';
import { firstValueFrom, map, Observable, ReplaySubject, shareReplay, switchMap } from 'rxjs';
import { toastData, ValidatorData } from 'src/app/models';
import { SolanaUtilsService, ToasterService, TxInterceptService, UtilsService } from 'src/app/services';
import { StakePoolProvider } from '../../stake-pool.model';
const { trackEvent } = Plausible();
import bn from 'bn.js'
import { depositSol } from '@solana/spl-stake-pool';
@Component({
  selector: 'app-stake-custom-validator',
  templateUrl: './stake-custom-validator.component.html',
  styleUrls: ['./stake-custom-validator.component.scss'],
})
export class StakeCustomValidatorComponent implements OnInit {
  @Input() selectedProvider: StakePoolProvider;
  @Input() solBalance;
  @Input() wallet;
  public validatorsData: Observable<ValidatorData[] | ValidatorData> = this._solanaUtilsService.getValidatorData().pipe(
    switchMap(async validators => {
      const eligibleVoteKeys: string[] = await this.getEligibleValidators();
      const filterValidators = validators.filter(validator => eligibleVoteKeys.find((votekey, i) => votekey == validator.vote_identity));
      return filterValidators
    }))

  public showValidatorList: boolean = false;
  public stakeForm: FormGroup;
  public formSubmitted: boolean = false;

  public selectedValidator: ValidatorData;
  public searchTerm = '';
  constructor(
    private _utilsService: UtilsService,
    private _fb: FormBuilder,
    private _solanaUtilsService: SolanaUtilsService,
    private _txInterceptService: TxInterceptService,
    private _toasterService: ToasterService
  ) { }

  ngOnInit() {
    this.stakeForm = this._fb.group({
      stakeAmount: ['', [Validators.required]],
      voteAccount: ['', [Validators.required]]
    })
  }

  async getEligibleValidators() {
    try {
      const getCLSList = await fetch('https://stake.solblaze.org/api/v1/cls_eligible_validators');
      const { vote_accounts } = await getCLSList.json();
      return vote_accounts;
    } catch (error) {
      return []
    }
  }
  setMaxAmount() {
    const amount = this._utilsService.shortenNum(this.solBalance - 0.0001);
    this.stakeForm.controls.stakeAmount.setValue(amount);
    // console.log(this.stakeAmount, this.solBalance)
  }
  public setSelectedValidator(validator: ValidatorData): void {
    this.selectedValidator = validator;
    this.stakeForm.controls.voteAccount.setValue(validator.vote_identity);
  }
  // stake custom validator
  public async stakeCLS() {
    trackEvent('custom validator stake' + this.selectedValidator.name)

    let { stakeAmount, voteAccount } = this.stakeForm.value;
    const validator = new PublicKey(voteAccount);

    const sol = new bn(stakeAmount * LAMPORTS_PER_SOL);

    const wallet = this.wallet.publicKey;

    try {
      let depositTx = await depositSol(
        this._solanaUtilsService.connection,
        this.selectedProvider.poolpubkey,
        wallet,
        Number(sol)
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


}
