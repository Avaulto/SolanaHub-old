import { Component, Input, OnInit } from '@angular/core';
import { LabStrategyConfiguration, StrategyClaimableAsset, WalletExtended } from 'src/app/models';
import { SolblazeFarmerService } from '../../strategies-builder/solblaze-farmer.service';

@Component({
  selector: 'app-claim',
  templateUrl: './claim.component.html',
  styleUrls: ['./claim.component.scss'],
})
export class ClaimComponent implements OnInit {
  @Input() walletExtended$: WalletExtended;
  @Input() strategyConfiguration: LabStrategyConfiguration
  public claimAssets: StrategyClaimableAsset[]
  public swapToSol: boolean = false;
  public loader: boolean = false;
  constructor(
    private _solblazeFarmerService:SolblazeFarmerService
  ) { }

  async ngOnInit() {
  }
  ngOnChanges(): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    this.claimAssets = this.strategyConfiguration.claimAssets
  }
  public updateSelection(ev): void {
    this.swapToSol = ev.detail.checked
  }
  public async claimReward() {
    if (this.strategyConfiguration.strategyName === 'solblaze-farmer') {

      this.loader = true
      await this._solblazeFarmerService.claimRewards(this.swapToSol)
      this.loader = false

    }
  }
}
