

import { Injectable } from '@angular/core';
import { Observable, shareReplay, Subject, throwError } from 'rxjs';
import { StakePoolProvider } from './stake-pool.model';
import { UtilsService, SolanaUtilsService, ToasterService } from 'src/app/services';
import { PublicKey } from '@solana/web3.js';
import { Marinade, MarinadeConfig } from '@marinade.finance/marinade-ts-sdk';
import * as StakePoolSDK from '@solana/spl-stake-pool';
import { toastData } from 'src/app/models';
@Injectable({
  providedIn: 'root'
})
export class StakePoolStoreService {
  private _provider$: Subject<StakePoolProvider> = new Subject();
  public provider$: Observable<StakePoolProvider> = this._provider$.asObservable().pipe(shareReplay(), this._utilService.isNotNull)
  public currentProvider
  public marinadeSDK: Marinade;
  public stakePoolSDK = StakePoolSDK;
  constructor(
    private _solanaUtilsService: SolanaUtilsService,
    private _utilService: UtilsService,
    private _toasterService: ToasterService
  ) { 

  }
  private _formatErrors(error: any) {
    const toastData: toastData = {
      message: error.message,
      segmentClass: "toastError",

    }
    this._toasterService.msg.next(toastData);
    return throwError((() => error))
  }

  // avaliable stake pool providers to select
  public providers: StakePoolProvider[] = [{
    poolName: 'Marinade',
    apy: null,
    exchangeRate: null,
    tokenSymbol: "mSOL",
    tokenMint: new PublicKey("mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So"),
    tokenImageURL: 'assets/images/icons/marinade-logo-small.svg',
    poolPublicKey: new PublicKey("stk9ApL5HeVAwPLr3TLhDXdZS8ptVu7zp6ov8HFDuMi"),
    MEVDelegation: false,
    website: "https://stake.solblaze.org/"
  },
  {
    poolName: "SolBlaze",
    apy: null,
    exchangeRate: null,
    tokenSymbol: "bSOL",
    tokenMint: new PublicKey("bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1"),
    tokenImageURL: 'assets/images/icons/solblaze-logo.png',
    poolPublicKey: new PublicKey("stk9ApL5HeVAwPLr3TLhDXdZS8ptVu7zp6ov8HFDuMi"),
    MEVDelegation: true,
    website: "https://stake.solblaze.org/"
  },
  // {
  //   poolName: "Jito",
  //   apy: null,
  //   exchangeRate: null,
  //   tokenSymbol: "JitoSOL",
  //   tokenMint: new PublicKey("J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn"),
  //   tokenImageURL: "https://storage.googleapis.com/token-metadata/JitoSOL-256.png",
  //   poolPublicKey: new PublicKey("Jito4APyf642JPZPx3hGc6WWJ8zPKtRbRs4P815Awbb"),
  //   MEVDelegation: true,
  //   website: "https://www.jito.network/"
  // },
  {
    poolName: "Cogent",
    apy: null,
    exchangeRate: null,
    tokenSymbol: "cgntSOL",
    tokenMint: new PublicKey("CgnTSoL3DgY9SFHxcLj6CgCgKKoTBr6tp4CPAEWy25DE"),
    tokenImageURL: "assets/images/icons/cgntSOL.png",
    poolPublicKey: new PublicKey("CgntPoLka5pD5fesJYhGmUCF8KU1QS1ZmZiuAuMZr2az"),
    MEVDelegation: true,
    website: "https://cogentcrypto.io/app"
  }
  ]
  // public getCurrentPorvider(): StakePoolProvider{
  //   return this._provider$.value;
  // }
  public updateSolBlazePool(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await (await fetch(
          "https://stake.solblaze.org/api/v1/update_pool?network=mainnet-beta"
        )).json();
        if (result.success) {
          resolve();
        } else {
          reject();
        }
      } catch (err) {
        reject();
      }
    });
  }
  public async selectProvider(provider: StakePoolProvider) {
    this._provider$.next(provider)
  }

  async initMarinade(wallet): Promise<void> {

    const config = new MarinadeConfig({
      connection: this._solanaUtilsService.connection,
      publicKey: wallet.publicKey,
      // referralCode: new PublicKey('9CLFBo1nsG24DNoVZvsSNEYRNGU1LAHGS5M3o9Ei33o6'),
    })
    this.marinadeSDK = new Marinade(config)
    const state = await this.marinadeSDK.getMarinadeState();
  }

}
