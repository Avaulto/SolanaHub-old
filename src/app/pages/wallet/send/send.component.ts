import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
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
  public sendCoinForm: FormGroup;
  public formSubmitted: boolean = false;
  selectedValidator;
  searchTerm = '';
  constructor(
    public loaderService:LoaderService,
    private _fb:FormBuilder,
    private _txInterceptService: TxInterceptService,
    private _utilsService: UtilsService,
    ) { }
  ngOnInit() {
    this.sendCoinForm = this._fb.group({
      amount: ['', [Validators.required]],
      targetAddress: ['', [Validators.required]],
    })
  }
  async pkVerifyValidator(){

    
    return  (control:AbstractControl) : ValidationErrors | null => {

      const value = control.value;
      const pk = new PublicKey(value)
      const isValid =  PublicKey.isOnCurve(pk.toBytes());
      if (!isValid) {
          return null;
      }
      
  

      return 
  }
  }
  setMaxAmount() {
    const fixedAmount = this._utilsService.shortenNum(this.wallet.balance - 0.0001)
    this.sendCoinForm.controls.amount.setValue(fixedAmount);
  }


  async send(){
    this.formSubmitted = true;
    const {amount, targetAddress} = this.sendCoinForm.value;
    const walletOwnerPublicKey = new PublicKey(this.wallet.address)
    const res = await this._txInterceptService.sendSol(amount * LAMPORTS_PER_SOL , targetAddress ,walletOwnerPublicKey)
    this.formSubmitted = false;
  }
}
