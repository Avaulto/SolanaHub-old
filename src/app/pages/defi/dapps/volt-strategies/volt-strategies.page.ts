import { Component, OnInit } from '@angular/core';
import { FriktionLocal, FriktionMarket, FriktionVol } from 'src/app/models';
import { ApiService, SolanaUtilsService, UtilsService } from 'src/app/services';
import {
  // sdk WITHOUT a user wallet attached
  VoltSDK,
  // sdk WITH a user wallet attached
  toConnectedSDK,
  FriktionSDK,
  NetworkName,
} from "@friktion-labs/friktion-sdk";
import { clusterApiUrl, PublicKey } from '@solana/web3.js';
import { AnchorProvider } from "@friktion-labs/anchor";
import { Wallet, WalletStore } from '@heavy-duty/wallet-adapter';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-volt-strategies',
  templateUrl: './volt-strategies.page.html',
  styleUrls: ['./volt-strategies.page.scss'],
})
export class VoltStrategiesPage implements OnInit {

  constructor(
    private _apiService: ApiService,
    private _solanaUtilsService: SolanaUtilsService,
    private _walletStore: WalletStore,
    private _utilsService:UtilsService

    ) { }

  public async getFriktionVol(): Promise<number> {
    const getVolReq = await fetch('https://api.friktion.fi/volume');
    const volumeList: FriktionVol[] = await getVolReq.json();
    const volumeTotal = volumeList.filter(vol => vol.globalId == 'all')[0];
    return volumeTotal.volume;
  }
  public async getFriktionMarketInfo(): Promise<FriktionLocal> {
    const getMarketInfoReq = await fetch('https://friktion-labs.github.io/mainnet-tvl-snapshots/friktionSnapshot.json');
    let marketInfo: FriktionMarket = await getMarketInfoReq.json();
    console.log(marketInfo);
    return;
  }
  public async friktionSDKInit() {
    this._walletStore.anchorWallet$.pipe(this._utilsService.isNotNull, this._utilsService.isNotUndefined).subscribe(async wallet => {
      console.log(wallet)
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

      // const cVoltSDK = toConnectedSDK(
      //   await friktionSDK.loadVoltSDKByKey(voltVaultId),
      //   connection,
      //   user,
      //   // below field is only used if depositing from a PDA or other program-owned account
      //   undefined
      // );

      console.log(friktionSDK)
      // console.log(cVoltSDK)
    })


  }
  ngOnInit() {
    this.getFriktionMarketInfo();
    this.friktionSDKInit();
  }

}
