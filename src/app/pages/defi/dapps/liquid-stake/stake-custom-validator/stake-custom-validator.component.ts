import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LAMPORTS_PER_SOL, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import Plausible from 'plausible-tracker';
import { firstValueFrom, map, Observable, ReplaySubject, shareReplay, Subject, switchMap } from 'rxjs';
import { toastData, ValidatorData } from 'src/app/models';
import { SolanaUtilsService, ToasterService, TxInterceptService, UtilsService } from 'src/app/services';
import { StakePoolProvider } from '../stake-pool.model';
const { trackEvent } = Plausible();
import bn from 'bn.js'
import { depositSol } from '@solana/spl-stake-pool';
@Component({
  selector: 'app-stake-custom-validator',
  templateUrl: './stake-custom-validator.component.html',
  styleUrls: ['./stake-custom-validator.component.scss'],
})
export class StakeCustomValidatorComponent implements OnInit {
  @Output() onValidatorSelect: EventEmitter<string> = new EventEmitter();
  public validatorsData$: Observable<ValidatorData[] | ValidatorData> = this._solanaUtilsService.getValidatorData().pipe(shareReplay(),
    switchMap(async validators => {
      const eligibleVoteKeys: string[] = await this.getEligibleValidators();
      const filterValidators = validators.filter(validator => eligibleVoteKeys.find((votekey, i) => votekey == validator.vote_identity));
      return filterValidators
    }))


  public showValidatorList: boolean = false;

  public selectedValidator: ValidatorData;
  constructor(
    private _solanaUtilsService: SolanaUtilsService,
  ) { }

  ngOnInit() {
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

  public setSelectedValidator(validator: ValidatorData): void {
    this.selectedValidator = validator;
    this.onValidatorSelect.emit(this.selectedValidator.vote_identity);
  }



}
