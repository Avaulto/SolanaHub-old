import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { observable, Observable, Subscriber } from 'rxjs';
import { Asset } from 'src/app/models';
import { LoaderService } from 'src/app/services';
import { SolanaUtilsService } from 'src/app/services/solana-utils.service';
import { TxInterceptService } from 'src/app/services/txIntercept.service';
import { ValidatorData } from 'src/app/shared/models/validatorData.model';

@Component({
  selector: 'app-stake',
  templateUrl: './stake.component.html',
  styleUrls: ['./stake.component.scss'],
})
export class StakeComponent implements OnInit {
  @Input() wallet: Asset;
  @Input() validatorData: ValidatorData[] = [];
  public showValidatorList: boolean = false;
  public stakeForm: FormGroup;
  public formSubmitted: boolean = false;
  public avaultoNode: ValidatorData;
  selectedValidator;
  searchTerm = '';

  constructor(
    public loaderService:LoaderService,
    private fb:FormBuilder,
    private txInterceptService: TxInterceptService,
    // private solanaUtils: SolanaUtilsService
    ) { }
  ngOnInit() {
    this.stakeForm = this.fb.group({
      amount: ['', [Validators.required]],
      voteAccount: ['', [Validators.required]],
    })
  }
  setMaxAmount() {
    this.stakeForm.controls.amount.setValue(this.wallet.balance - 0.01);
  }
  onSearch(term: any) {
    this.searchTerm = term.value;
  }
  setSelectedValidator(validator:ValidatorData) {
    this.selectedValidator = validator;
    this.showValidatorList = !this.showValidatorList

    this.stakeForm.controls.voteAccount.setValue(validator.vote_identity);
  }
  submitNewStake(){
    const {amount, voteAccount} = this.stakeForm.value;
    const walletOwnerPublicKey =  this.wallet.publicKey;
    
    this.txInterceptService.delegate(amount * LAMPORTS_PER_SOL,walletOwnerPublicKey,voteAccount)
  }
}
