import { Component, OnInit } from '@angular/core';
import { AllMainnetVolt, FriktionLocal, FriktionMarket, FriktionVol } from 'src/app/models';
import { ApiService, SolanaUtilsService, UtilsService } from 'src/app/services';
import { AnchorProvider } from "@friktion-labs/anchor";
import {
  // sdk WITHOUT a user wallet attached
  VoltSDK,
  // sdk WITH a user wallet attached
  toConnectedSDK,
  FriktionSDK,
  NetworkName,
} from "@friktion-labs/friktion-sdk";
import { clusterApiUrl, PublicKey } from '@solana/web3.js';
// import { AnchorProvider } from "@friktion-labs/anchor";
import { Wallet, WalletStore } from '@heavy-duty/wallet-adapter';
import { BehaviorSubject} from 'rxjs';
import { environment } from 'src/environments/environment';
import { faCrosshairs } from '@fortawesome/free-solid-svg-icons';
import { faChessKnight } from '@fortawesome/free-regular-svg-icons';

interface FriktionInfo {
  volume: number;
  tvl: number;
  numOfProducts: number;
  mostDepositedAsset: string;
}
@Component({
  selector: 'app-volt-strategies',
  templateUrl: './volt-strategies.page.html',
  styleUrls: ['./volt-strategies.page.scss'],
})

export class VoltStrategiesPage implements OnInit {
  public voltType1Icon = faCrosshairs;
  public voltType2Icon = faCrosshairs;
  public voltType3Icon = faChessKnight;
  public voltType4Icon = faCrosshairs;
  public voltType5Icon = faCrosshairs;

  readonly isReady$ = this._walletStore.connected$;
  public voltsFilter = [];
  private voltsOriginal: AllMainnetVolt[] = [];
  public voltsData: BehaviorSubject<AllMainnetVolt[]> = new BehaviorSubject([] as AllMainnetVolt[]);
  public friktionInfo:FriktionInfo = null;
  constructor(
    private _apiService: ApiService,
    private _solanaUtilsService: SolanaUtilsService,
    private _walletStore: WalletStore,
    private _utilsService: UtilsService

  ) { }

  public async getFriktionVol(): Promise<number> {
    const getVolReq = await fetch('https://api.friktion.fi/volume');
    const volumeList: FriktionVol[] = await getVolReq.json();
    const volumeTotal = volumeList.filter(vol => vol.globalId == 'all')[0];
    return volumeTotal.volume;
  }
  public async getFriktionMarketInfo(): Promise<FriktionMarket> {
    const getMarketInfoReq = await fetch('https://friktion-labs.github.io/mainnet-tvl-snapshots/friktionSnapshot.json');
    let marketInfo: FriktionMarket = await getMarketInfoReq.json();
    return marketInfo;
  }
  public async friktionSDKInit() {
    this._walletStore.anchorWallet$.pipe(this._utilsService.isNotNull, this._utilsService.isNotUndefined).subscribe(async wallet => {
      const provider = new AnchorProvider(
        this._solanaUtilsService.connection,
        wallet,
        {}
      );
      const connection = provider.connection;
      const user = provider.wallet.publicKey;
      // SOL Covered Call Volt pubkey
      const voltVaultId = new PublicKey(
        "CbPemKEEe7Y7YgBmYtFaZiECrVTP5sGrYzrrrviSewKY"
      );

      const networkName = environment.solanaEnv as NetworkName
      const friktionSDK: FriktionSDK = new FriktionSDK({
        provider, // e.g AnchorProvider
        network: networkName, // e.g mainnet-beta
      });

      const cVoltSDK = toConnectedSDK(
        await friktionSDK.loadVoltSDKByKey(voltVaultId),
        connection,
        user,
        // below field is only used if depositing from a PDA or other program-owned account
        undefined
      );

      console.log(friktionSDK)
      // console.log(cVoltSDK)
    })


  }
  async ngOnInit() {
    const friktionMarketInfo = await this.getFriktionMarketInfo();
    const volume = await this.getFriktionVol();
    this.voltsOriginal = friktionMarketInfo.allMainnetVolts.filter(volt => volt.apy);
    console.log(friktionMarketInfo)
    this.friktionInfo = {
      tvl: friktionMarketInfo.totalTvlUSD,
      volume,
      numOfProducts: friktionMarketInfo.allMainnetVolts.length,
      mostDepositedAsset: 'SOL'
    }
    this.voltsData.next(this.voltsOriginal);
    // this.friktionSDKInit();
  }

  public filterVolt(type: number){
    // add or remove type from volt filter
    this.voltsFilter[type] === undefined ?  this.voltsFilter[type] = type : this.voltsFilter[type] = undefined;
    // delete undefined items
    const removeUndefineds = this.voltsFilter.filter(type => type != undefined);
    // filterout volts base on array of "whitelist types"
    const voltsDataFiltered = this.voltsOriginal.filter(volt => removeUndefineds.includes(volt.voltType -1));

    // if array of whitelist types is empty send the original default volts data
    if(removeUndefineds.length != 0){
      this.voltsData.next(voltsDataFiltered);
    }else{
      this.voltsData.next(this.voltsOriginal);
    }
  }
  searchTerm = ''
  public searchVolt(term: any):void {
    this.searchTerm = term.value.toLowerCase();
  }
}
