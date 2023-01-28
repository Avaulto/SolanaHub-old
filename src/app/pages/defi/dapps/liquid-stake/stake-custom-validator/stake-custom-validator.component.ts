import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { firstValueFrom, map, Observable, ReplaySubject, shareReplay, Subject, switchMap } from 'rxjs';
import { toastData, ValidatorData } from 'src/app/models';
import { SolanaUtilsService, ToasterService, TxInterceptService, UtilsService } from 'src/app/services';
@Component({
  selector: 'app-stake-custom-validator',
  templateUrl: './stake-custom-validator.component.html',
  styleUrls: ['./stake-custom-validator.component.scss'],
})
export class StakeCustomValidatorComponent implements OnInit {
  @Output() onValidatorSelect: EventEmitter<string> = new EventEmitter();
  public validatorsData$: Observable<ValidatorData[] | ValidatorData> = this._solanaUtilsService.getValidatorData().pipe(shareReplay(),
    switchMap(async (validators: ValidatorData[]) => {
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
