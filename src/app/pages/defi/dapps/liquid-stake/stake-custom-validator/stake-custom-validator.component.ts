import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { firstValueFrom, map, Observable, ReplaySubject, shareReplay, Subject, switchMap } from 'rxjs';
import { toastData, ValidatorData } from 'src/app/models';
import { SolanaUtilsService, ToasterService, TxInterceptService, UtilsService } from 'src/app/services';

 interface MarinadeSnapshot {
  mSolSnapshotCreatedAt: string
  voteRecordsCreatedAt: string
  records: Record[]
}

 interface Record {
  amount?: string
  tokenOwner: string
  validatorVoteAccount: string
}

@Component({
  selector: 'app-stake-custom-validator',
  templateUrl: './stake-custom-validator.component.html',
  styleUrls: ['./stake-custom-validator.component.scss'],
})
export class StakeCustomValidatorComponent implements OnInit {
  @Output() onValidatorSelect: EventEmitter<string> = new EventEmitter();
  @Input() poolName: string = null;
  public validatorsData$: Observable<ValidatorData[] | ValidatorData> = this._solanaUtilsService.getValidatorData().pipe(
  switchMap(async (validators: ValidatorData[]) => {
      let eligibleVoteKeys: string[] = null;
      if(this.poolName.toLowerCase() == 'solblaze'){
        eligibleVoteKeys = await this.getSolBlazeEligibleValidators();
      }else{
        eligibleVoteKeys = await this.getMariandeEligibleValidators();
      }
      const filterValidators = validators.filter(validator => eligibleVoteKeys.find((votekey, i) => votekey == validator.vote_identity));
      return filterValidators
    }),
    shareReplay()
    )


  public showValidatorList: boolean = false;

  public selectedValidator: ValidatorData;
  constructor(
    private _solanaUtilsService: SolanaUtilsService,
  ) { }

  ngOnInit() {
  }

  async getSolBlazeEligibleValidators() {
    try {
      const getCLSList = await fetch('https://stake.solblaze.org/api/v1/cls_eligible_validators');
      const { vote_accounts } = await getCLSList.json();
      return vote_accounts;
    } catch (error) {
      return []
    }
  }

  async getMariandeEligibleValidators() {
    try {
      const getCLSList = await fetch('https://validators-api.marinade.finance/validators/scores');
      const validatorList = await getCLSList.json();
      const vote_accounts = validatorList.scores.filter(validator => validator.eligible_stake_msol).map(validator => validator.vote_account)
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
