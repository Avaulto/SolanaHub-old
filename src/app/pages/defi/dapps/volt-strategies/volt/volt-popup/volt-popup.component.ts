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
  constructor() { }

  ngOnInit() {
    console.log(this.volt)
  }
  public setUtil(util: string): void{
    this.segmentUtilTab = util;
  }
  public setMaxAmount(): void {
    // const fixedAmount = this._utilsService.shortenNum(this.wallet.balance - 0.0001)
    // this.stakeForm.controls.amount.setValue(fixedAmount);
  }
}
