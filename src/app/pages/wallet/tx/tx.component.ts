import { Component, Input, OnInit } from '@angular/core';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { map, Observable, Subscription } from 'rxjs';
import { Asset, ValidatorData } from 'src/app/models';
import { SolanaUtilsService } from 'src/app/services/solana-utils.service';

@Component({
  selector: 'app-tx',
  templateUrl: './tx.component.html',
  styleUrls: ['./tx.component.scss'],
})
export class TxComponent implements OnInit {
  @Input() wallet:Asset;
  public validatorsData: Observable<ValidatorData[]> = this._solanaUtilsService.getValidatorData()
  public segmentUtilTab: string = 'stake'
  public hasStake: boolean = false;
  public avgApy:number = 0;
  constructor(
    private _solanaUtilsService: SolanaUtilsService,
    ) { }

  ngOnInit() {
    this._solanaUtilsService.getAvgApy().subscribe(avgApy => this.avgApy = avgApy)
  }
  setUtil(util: string){
    this.segmentUtilTab = util;
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    // this.validatorsData.unsubscribe();
  }
}
