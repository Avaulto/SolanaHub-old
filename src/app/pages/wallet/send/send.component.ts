import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { observable, Observable, Subscriber } from 'rxjs';
import { Asset } from 'src/app/models';
import { LoaderService, UtilsService } from 'src/app/services';
import { SolanaUtilsService } from 'src/app/services/solana-utils.service';
import {  TxInterceptService } from 'src/app/services/txIntercept.service';

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.scss'],
})
export class SendComponent implements OnInit {
  @Input() wallet: Asset;
  public showValidatorList: boolean = false;
  public sendSolForm: FormGroup;
  public formSubmitted: boolean = false;
  selectedValidator;
  searchTerm = '';
  constructor(
    public loaderService:LoaderService,
    private fb:FormBuilder,
    private txInterceptService: TxInterceptService,
    private utils: UtilsService,
    ) { }
  ngOnInit() {
    this.sendSolForm = this.fb.group({
      amount: ['', [Validators.required]],
      targetAddress: ['', [Validators.required]],
    })
  }
  setMaxAmount() {
    const fixedAmount = this.utils.shortenNum(this.wallet.balance - 0.0001)
    this.sendSolForm.controls.amount.setValue(fixedAmount);
  }


  async submitSendSol(){
    this.formSubmitted = true;
    const {amount, targetAddress} = this.sendSolForm.value;
    const walletOwnerPublicKey = new PublicKey(this.wallet.address)
    const res = await this.txInterceptService.sendSol(amount * LAMPORTS_PER_SOL , targetAddress ,walletOwnerPublicKey)
    this.formSubmitted = false;
  }
}
