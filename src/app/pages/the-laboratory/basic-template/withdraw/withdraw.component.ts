import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Asset, LabStrategyConfiguration, WalletExtended } from 'src/app/models';
import { MarinadePlusService } from '../../strategies-builder/marinade-plus.service';
import { JupiterStoreService } from 'src/app/services';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.scss'],
})
export class WithdrawComponent  implements OnChanges {
  @Input() walletExtended$: WalletExtended;
  @Input() strategyConfiguration: LabStrategyConfiguration;
  constructor(
    private _marinadePlusService: MarinadePlusService,
    private _jupiterStoreService:JupiterStoreService
     ) { }

     ngOnChanges(changes): void {
      console.log(this.walletExtended$)
      if(this.walletExtended$){
        this._jupiterStoreService.initJup(this.walletExtended$)
      }
     }

  public withdraw(): void{
    if (this.strategyConfiguration.strategyName === 'marinade-plus') {
      const mSOL_holding = this.strategyConfiguration.assetHoldings[0].balance;
      this._marinadePlusService.withdraw(mSOL_holding)
    }
  }
}
