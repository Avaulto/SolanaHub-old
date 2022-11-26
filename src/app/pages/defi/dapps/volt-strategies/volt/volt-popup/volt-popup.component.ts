import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AllMainnetVolt } from 'src/app/models';

@Component({
  selector: 'app-volt-popup',
  templateUrl: './volt-popup.component.html',
  styleUrls: ['./volt-popup.component.scss'],
})
export class VoltPopupComponent implements OnInit {
  @Input() volt: AllMainnetVolt = null;
  @Output() onFlipVolt = new EventEmitter();
  public segmentUtilTab: string = 'deposit'
  public voltDetailBox:boolean = false;
  public toolTipHtml = '';
  public tooltipoptions = {
    tooltipClass: 'friktion-tool-tip',
    hideDelay: 400000,
    maxWidth: '320px',
    placement:'bottom'
    
  }
  constructor() { }

  ngOnInit() {
    this.toolTipHtml = `  <div class="tooltip-wrapper">

    <div>
      <span>Underlying asset</span>
      <span>${this.volt.underlyingTokenSymbol}</span>
    </div>
    <div >
      <span>Capacity</span>
      <span>${this.volt.tvlUsd} / ${this.volt.capacityUsd}</span>
    </div>

  </div>`
  }
  public setUtil(util: string): void{
    this.segmentUtilTab = util;
  }
  public setMaxAmount(): void {
    // const fixedAmount = this._utilsService.shortenNum(this.wallet.balance - 0.0001)
    // this.stakeForm.controls.amount.setValue(fixedAmount);
  }
}
