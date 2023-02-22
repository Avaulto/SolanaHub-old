import { DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IonCheckbox, NavController } from '@ionic/angular';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Asset } from 'src/app/models';

import { UtilsService } from 'src/app/services';

@Component({
  selector: 'app-assets-balance',
  templateUrl: './assets-balance.component.html',
  styleUrls: ['./assets-balance.component.scss'],
  providers:[DecimalPipe]
})
export class AssetsBalanceComponent implements OnInit {
  @Input() title: string; 
  @Input() asset: Asset
  @Input() mergeCondition: boolean = false;
  public rentAccountSize = 2039280;
  public rentAccountSizeInSOL = this.rentAccountSize / LAMPORTS_PER_SOL
  public totalBalanceLamport;
  @Input() isChecked: boolean;
  @Output() onClickAsset: EventEmitter<any> = new EventEmitter();
  @ViewChild('checkbox') checkbox: IonCheckbox;
  constructor( private _utilsService:UtilsService) { }

  ngOnInit() {
    this.totalBalanceLamport = this.asset.totalSolValue * LAMPORTS_PER_SOL
  }
  formatNumber = n => {
    return this._utilsService.formatBigNumbers(n) ;
  };
  appendAssetData(){
    this.onClickAsset.emit({ asset:this.asset, assetCheckbox:this.checkbox})
  }
}
