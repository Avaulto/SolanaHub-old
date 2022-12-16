import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AllMainnetVolt } from 'src/app/models';
import { UtilsService } from 'src/app/services';

@Component({
  selector: 'app-volt-popup',
  templateUrl: './volt-popup.component.html',
  styleUrls: ['./volt-popup.component.scss'],
})
export class VoltPopupComponent implements OnInit {
  @Input() volt: AllMainnetVolt = null;
  @Output() onFlipVolt = new EventEmitter();
  @Output() onDepositVolt = new EventEmitter();
  public depositVoltForm: FormGroup;
  // public formSubmitted: boolean = false;
  public segmentUtilTab: string = 'deposit'
  public voltDetailBox:boolean = false;
  public toolTipHtml = '';
  public tooltipoptions = {
    tooltipClass: 'friktion-tool-tip',
    hideDelay: 3000,
    maxWidth: '320px',
    placement:'bottom'
  }
  constructor(private _fb: FormBuilder, private _utilsService:UtilsService) { }

  ngOnInit() {
    this.depositVoltForm = this._fb.group({
      amount: ['', [Validators.required]],
      voltId: [this.volt.voltVaultId, [Validators.required]]
    })

    this.toolTipHtml = `  <div class="tooltip-wrapper">

    <div>
      <span>Underlying asset</span>
      <span>${this.volt.underlyingTokenSymbol}</span>
    </div>
    <div >
      <span>Capacity</span>
      <span>${this._utilsService.shortenNum(this.volt.tvlUsd)} / ${this.volt.capacityUsd}</span>
    </div>
    <div >
      <span>performance FeeRate</span>
      <span>${this.volt.performanceFeeRate}</span>
    </div>  
    <div >
      <span>APY after fees</span>
      <span>${this.volt.apyAfterFees}%</span>
    </div>  
    <div >
      <span>Vault Authority</span>
      <span>${this._utilsService.addrUtil(this.volt.vaultAuthority).addrShort} </span>
    </div>  
    <div >
      <span>Deposit pool</span>
      <span>${this._utilsService.addrUtil(this.volt.depositPool).addrShort}</span>
    </div> 
  </div>`
  }

  public setUtil(util: string): void{
    this.segmentUtilTab = util;
  }
  public setMaxAmount(): void {
    // const fixedAmount = this._utilsService.shortenNum(this.wallet.balance - 0.0001)
    this.depositVoltForm.controls.amount.setValue(this.volt.tokenBalance);
  }
  public deposit(){
    
    const joinVoltInfo = this.depositVoltForm.value;
    this.onDepositVolt.emit(joinVoltInfo)
  }
}
