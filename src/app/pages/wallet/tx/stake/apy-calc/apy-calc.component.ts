import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-apy-calc',
  templateUrl: './apy-calc.component.html',
  styleUrls: ['./apy-calc.component.scss'],
})
export class ApyCalcComponent implements OnInit {
  @Input() rewardInfo: {apy: number, amount: number} = {apy: 0, amount: 0};
  constructor() { }

  ngOnInit() {}
  public calcCoinROI (  days: number) {
    return ((this.rewardInfo.apy / 100) * this.rewardInfo.amount / days).toLocaleString();
  }
}
