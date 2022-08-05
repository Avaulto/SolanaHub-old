import { Component, Input, OnInit } from '@angular/core';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { distinctUntilChanged, first, Observable, take, takeLast, takeUntil } from 'rxjs';
import { Asset } from 'src/app/models';
import { SolanaUtilsService } from 'src/app/services/solana-utils.service';
import { StakeAccountExtended } from 'src/app/shared/models/stakeAccountData.model';
import { ValidatorData } from 'src/app/shared/models/validatorData.model';

@Component({
  selector: 'app-tx',
  templateUrl: './tx.component.html',
  styleUrls: ['./tx.component.scss'],
})
export class TxComponent implements OnInit {
  @Input() wallet:Asset;
  public validatorData: ValidatorData[] = [];
  segmentUtilTab: string = 'stake'
  public hasStake: boolean = false;
  public avgApy:number = 0;
  constructor(
    private solanaUtilsService: SolanaUtilsService,
    private _walletStore:WalletStore
    ) { }

  ngOnInit() {
    this.solanaUtilsService.getAvgApy().subscribe(avgApy => this.avgApy = avgApy)
    this.solanaUtilsService.getValidatorData().subscribe(async validatorList => {
      this.validatorData = validatorList
    });
  }
  setUtil(util: string){
    this.segmentUtilTab = util;
  }
}
