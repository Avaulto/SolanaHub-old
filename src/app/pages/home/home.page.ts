import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { EpochInfo, LAMPORTS_PER_SOL, RpcResponseAndContext, Supply, VoteAccountStatus } from '@solana/web3.js';
import { forkJoin, map, Observable, shareReplay, Subject, tap } from 'rxjs';
import { CoinData } from 'src/app/models';
import { ApiService, LoaderService, UtilsService } from 'src/app/services';
import { DataAggregatorService } from 'src/app/services/data-aggregator.service';
import { SolanaUtilsService } from 'src/app/services/solana-utils.service';

interface ClusterInfo {
  TPS: string,
  supply?: any,
  stakeInfo: { activeStake: any, delinquentStake: any },
  solData: CoinData;
  epochInfo;
}
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  public clusterInfo: Observable<ClusterInfo> = forkJoin({
    solData: this._getSOLprice(),
    stakeInfo: this._solanaUtilsService.getStake(),
    TPS: this._solanaUtilsService.getTPS(),
    epochInfo: this._solanaUtilsService.getEpochInfo(),
    supply: this._solanaUtilsService.getSupply()
  }).pipe(shareReplay(),map( (data: any) => {
    
    data.TPS = Math.trunc(data?.TPS)
    return data
  }))

  public getSupply: Subject<any> = new Subject();
  constructor(
    private _dataAggregatorService: DataAggregatorService,
    private _solanaUtilsService: SolanaUtilsService,
    public loaderService: LoaderService,
    public _titleService: Title,
  ) {
  }
  ionViewWillEnter(){
    this._titleService.setTitle('SolanaHub - home')
  }
  async ngOnInit() {
    const getSupply = await this._solanaUtilsService.getSupply();
    this.getSupply.next(getSupply)
  }
  ngOnDestroy(): void {
  }

  private _getSOLprice(): Observable<any> {
    return this._dataAggregatorService.getCoinData('solana')
  }
}
