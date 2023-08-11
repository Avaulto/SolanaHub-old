import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Asset, LabStrategyConfiguration, WalletExtended } from 'src/app/models';
import { MarinadePlusService } from '../../strategies-builder/marinade-plus.service';
import { JupiterStoreService } from 'src/app/services';
import { SolblazeFarmerService } from '../../strategies-builder/solblaze-farmer.service';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.scss'],
})
export class WithdrawComponent implements OnChanges {
  @Input() walletExtended$: WalletExtended;
  @Input() strategyConfiguration: LabStrategyConfiguration;
  public loader: boolean = false;
  constructor(
    private _marinadePlusService: MarinadePlusService,
    private _solblazeFarmerService: SolblazeFarmerService,
    private _jupiterStore: JupiterStoreService,
  ) { }

  ngOnChanges(changes): void {
    if(this.walletExtended$){
      this._jupiterStore.initJup(this.walletExtended$)
    }
  }

  public async withdraw() {
    if (this.strategyConfiguration.strategyName === 'marinade-plus') {
      const mSOL_holding = this.strategyConfiguration.assetHoldings[0].balance;
      this._marinadePlusService.withdraw(mSOL_holding)
    }
    if (this.strategyConfiguration.strategyName === 'solblaze-farmer') {
      this.loader = true
      await this._solblazeFarmerService.withdraw()
      this._solblazeFarmerService.fetchUserHoldings$.next(true)
      this.loader = false
    }
  }
}
