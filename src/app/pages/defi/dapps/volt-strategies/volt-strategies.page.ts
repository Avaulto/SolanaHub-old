import { Component, OnInit } from '@angular/core';
import { AllMainnetVolt, FriktionLocal, FriktionMarket, FriktionVol, TokenBalance } from 'src/app/models';
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
import { clusterApiUrl, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
// import { AnchorProvider } from "@friktion-labs/anchor";
import { Wallet, WalletStore } from '@heavy-duty/wallet-adapter';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { faCrosshairs } from '@fortawesome/free-solid-svg-icons';
import { faChessKnight } from '@fortawesome/free-regular-svg-icons';
import Decimal from 'decimal.js';

interface FriktionInfo {
  volume: number;
  tvl: number;
  numOfProducts: number;
  mostDepositedAsset: string;
}

export interface Token {
  chainId: number; // 101,
  address: string; // 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  symbol: string; // 'USDC',
  name: string; // 'Wrapped USDC',
  decimals: number; // 6,
  logoURI: string; // 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/BXXkv6z8ykpG1yuvUDPgh732wzVHB69RnB9YgSYh3itW/logo.png',
  tags: string[]; // [ 'stablecoin' ]
  token: Token;
  balance?: number;
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
  public friktionInfo: FriktionInfo = null;
  constructor(
    private _solanaUtilService: SolanaUtilsService,
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
  public getHighVolt(volt: AllMainnetVolt): AllMainnetVolt | null {

    return this.voltsOriginal.filter(i => i.globalId == volt.highVoltage)[0] || null
  }
  public friktionSDK: FriktionSDK = null;
  public async friktionSDKInit() {
    this._walletStore.anchorWallet$.pipe(this._utilsService.isNotNull, this._utilsService.isNotUndefined).subscribe(async wallet => {
      const provider = new AnchorProvider(
        this._solanaUtilService.connection,
        wallet,
        {}
      );
      await this._setTokensBalance();

      const networkName = environment.solanaEnv as NetworkName
      this.friktionSDK = new FriktionSDK({
        provider, // e.g AnchorProvider
        network: networkName, // e.g mainnet-beta
      });

      // console.log(cVoltSDK)
    })
  }
  async ngOnInit() {
    const friktionMarketInfo = await this.getFriktionMarketInfo();
    const volume = await this.getFriktionVol();
    const hideNoneApyVolts = friktionMarketInfo.allMainnetVolts.filter(volt => volt.apy);
    this.voltsOriginal = hideNoneApyVolts // this.mergeDuplicateDepositAssetVolts(hideNoneApyVolts);
    console.log(this.voltsOriginal);
    console.log(friktionMarketInfo)
    this.friktionInfo = {
      tvl: friktionMarketInfo.totalTvlUSD,
      volume,
      numOfProducts: friktionMarketInfo.allMainnetVolts.length,
      mostDepositedAsset: 'SOL'
    }
    this.voltsData.next(this.voltsOriginal);
    this.friktionSDKInit();
  }

  public voltExists(type:number): boolean{
    return this.voltsOriginal.filter(volt => volt.voltType == type).length > 0
  }
  public filterVolt(type: number) {
    // add or remove type from volt filter
    this.voltsFilter[type] === undefined ? this.voltsFilter[type] = type : this.voltsFilter[type] = undefined;
    // delete undefined items
    const removeUndefineds = this.voltsFilter.filter(type => type != undefined);
    // filterout volts base on array of "whitelist types"
    const voltsDataFiltered = this.voltsOriginal.filter(volt => removeUndefineds.includes(volt.voltType - 1));

    // if array of whitelist types is empty send the original default volts data
    if (removeUndefineds.length != 0) {
      this.voltsData.next(voltsDataFiltered);
    } else {
      this.voltsData.next(this.voltsOriginal);
    }
  }
  searchTerm = ''
  public searchVolt(term: any): void {
    this.searchTerm = term.value.toLowerCase();
  }
  private async _getTokenBalance(): Promise<TokenBalance[]> {
    const walletOwner = await (await firstValueFrom(this._walletStore.anchorWallet$)).publicKey;
    const walletBalance = await this._solanaUtilService.connection.getBalance(walletOwner) / LAMPORTS_PER_SOL;
    const solTokenBalance = { tokenPubkey: walletOwner.toBase58(), mintAddress: 'So11111111111111111111111111111111111111112', balance: walletBalance }
    const accountsBalance = await this._solanaUtilService.getTokenAccountsBalance(walletOwner.toBase58());
    accountsBalance.push(solTokenBalance)
    return accountsBalance
  }
  private async _setTokensBalance() {
    const res = await this._getTokenBalance();
    this.voltsOriginal.map(volt => {
      let tokenBalance = res.find(account => account.mintAddress == volt.depositTokenMint)?.balance || 0;
      return volt.tokenBalance = this._utilsService.shortenNum(tokenBalance);
    })
  }
  public async initDeposit(voltForm) {
    const voltVaultId = new PublicKey(voltForm.voltId);
    const depositAmount: Decimal = new Decimal(voltForm.amount);
    const user = (await firstValueFrom(this._walletStore.anchorWallet$)).publicKey;
    console.log(voltForm,this.friktionSDK, user);

    const cVoltSDK = toConnectedSDK(
      await this.friktionSDK.loadVoltSDKByKey(voltVaultId),
      this._solanaUtilService.connection,
      user,
      // below field is only used if depositing from a PDA or other program-owned account
      undefined
    );
     debugger;
    await cVoltSDK.doFullDeposit(depositAmount);

  }
}
