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
  constructor(
    private _marinadePlusService: MarinadePlusService,
    private _solblazeFarmerService: SolblazeFarmerService
  ) { }

  ngOnChanges(changes): void {

  }

  public async withdraw() {
    if (this.strategyConfiguration.strategyName === 'marinade-plus') {
      const mSOL_holding = this.strategyConfiguration.assetHoldings[0].balance;
      this._marinadePlusService.withdraw(mSOL_holding)
    }
    if (this.strategyConfiguration.strategyName === 'solblaze-farmer') {

      await this._solblazeFarmerService.withdraw()
      this._solblazeFarmerService.fetchUserHoldings$.next(true)
    }
  }
}
