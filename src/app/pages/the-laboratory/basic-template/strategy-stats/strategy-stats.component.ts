import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { DefiStat, WalletExtended } from 'src/app/models';
import { JupiterStoreService, SolanaUtilsService, UtilsService } from 'src/app/services';
import { SolblazeFarmerService } from '../../strategies-builder/solblaze-farmer.service';

@Component({
  selector: 'app-strategy-stats',
  templateUrl: './strategy-stats.component.html',
  styleUrls: ['./strategy-stats.component.scss'],
})
export class StrategyStatsComponent implements  OnChanges {
  @Output() onApyReady = new EventEmitter()
  @Input() userHoldings = { SOL: null, USD: null };
  @Input() strategyName: string = '';
  public strategyStats = {
    userHoldings: this.userHoldings,
    protocolLoop: null,
    TVL: { SOL: null, USD: null },
    apy: null,
  };
  constructor(
    private _solblazeFarmerService: SolblazeFarmerService,
  ) { }


  async ngOnChanges(changes): Promise<void> {
    const loadStats = changes.strategyName?.currentValue != changes.strategyName?.previousValue && changes.strategyName?.currentValue
    if(loadStats){
      await this.fetchStrategyStats(this.strategyName);
    }
    this.strategyStats.userHoldings = this.userHoldings
  }
  async fetchStrategyStats(strategyName: string) {
    let stats;
    if (strategyName.toLowerCase() === 'marinade-plus') {
    }
    if (this.strategyName.toLowerCase() === 'solblaze-farmer') {
      this.strategyStats.protocolLoop = 2
       stats = await this._solblazeFarmerService.initStrategyStats();
    }
    this.strategyStats.apy = stats.apy.strategyAPY
    this.strategyStats.TVL = stats.tvl;
    this.onApyReady.emit(this.strategyStats.apy);
  }

}
