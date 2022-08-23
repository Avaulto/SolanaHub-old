import { Component, Input, OnInit } from '@angular/core';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { Subscription } from 'rxjs';
import { Asset } from 'src/app/models';
import { SolanaUtilsService } from 'src/app/services/solana-utils.service';

@Component({
  selector: 'app-tx',
  templateUrl: './tx.component.html',
  styleUrls: ['./tx.component.scss'],
})
export class TxComponent implements OnInit {
  @Input() wallet:Asset;
  public validatorsData: Subscription = this.solanaUtilsService.getValidatorData().subscribe();
  segmentUtilTab: string = 'stake'
  public hasStake: boolean = false;
  public avgApy:number = 0;
  constructor(
    private solanaUtilsService: SolanaUtilsService,
    private _walletStore:WalletStore
    ) { }

  ngOnInit() {
    this.solanaUtilsService.getAvgApy().subscribe(avgApy => this.avgApy = avgApy)
  }
  setUtil(util: string){
    this.segmentUtilTab = util;
  }
}
