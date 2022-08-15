import { Component, OnDestroy, OnInit } from '@angular/core';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { EpochInfo, LAMPORTS_PER_SOL, RpcResponseAndContext, Supply, VoteAccountStatus } from '@solana/web3.js';
import { forkJoin, map, Observable } from 'rxjs';
import { ApiService, LoaderService, UtilsService } from 'src/app/services';
import { DataAggregatorService } from 'src/app/services/data-aggregator.service';
import { SolanaUtilsService } from 'src/app/services/solana-utils.service';

interface ClusterInfo {
  TPS: any,
  supply: { circulating: any, noneCirculating: any },
  stakeInfo: { activeStake: any, delinquentStake: any },
  solData: any;
  epochInfo;
}
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  public clusterInfo: Observable<ClusterInfo> = forkJoin({
    solData: this.getSOLprice(),
    stakeInfo: this.solanaUtilsService.getStake(),
    supply: this.solanaUtilsService.getSupply(),
    TPS: this.solanaUtilsService.getTPS(),
    epochInfo: this.solanaUtilsService.getEpochInfo()
  }).pipe(map((data) => {
    data.TPS = Math.trunc(data?.TPS)
    return data
  }))

  constructor(
    private dataAggregatorService: DataAggregatorService,
    private solanaUtilsService: SolanaUtilsService,
    public loaderService: LoaderService,
  ) {
  }

  ngOnInit(): void {
    this.clusterInfo.subscribe(val => console.log(val))
  }
  ngOnDestroy(): void {
  }

  private getSOLprice(): Observable<any> {
    return this.dataAggregatorService.getCoinData('solana')
  }
}
