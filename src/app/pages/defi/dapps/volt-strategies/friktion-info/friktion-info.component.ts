import { Component, Input, OnInit } from '@angular/core';
interface FriktionInfo {
  volume: number;
  tvl: number;
  numOfProducts: number;
  mostDepositedAsset: string;
}
@Component({
  selector: 'app-friktion-info',
  templateUrl: './friktion-info.component.html',
  styleUrls: ['./friktion-info.component.scss'],
})
export class FriktionInfoComponent implements OnInit {
@Input() friktionInfo: FriktionInfo = null
  constructor() { }

  ngOnInit() {}

}
