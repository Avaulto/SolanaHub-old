import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tx',
  templateUrl: './tx.component.html',
  styleUrls: ['./tx.component.scss'],
})
export class TxComponent implements OnInit {
  segmentUtilTab: string = 'stake'
  public hasStake: boolean = false;
  constructor() { }

  ngOnInit() {}
  setUtil(util: string){
    this.segmentUtilTab = util;
  }
}
