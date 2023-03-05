

import { Injectable } from '@angular/core';
import { Observable, shareReplay, Subject, throwError } from 'rxjs';
import { StakePoolProvider } from './stake-pool.model';
import { UtilsService, SolanaUtilsService, ToasterService } from 'src/app/services';
import { environment } from 'src/environments/environment';
import { PublicKey } from '@solana/web3.js';
import { Marinade, MarinadeConfig } from '@marinade.finance/marinade-ts-sdk';
import * as StakePoolSDK from '@solana/spl-stake-pool';
import { toastData } from 'src/app/models';
@Injectable({
  providedIn: 'root'
})
export class StakePoolStoreService {

  constructor(
    private _solanaUtilsService: SolanaUtilsService,
    private _utilService: UtilsService,
    private _toasterService: ToasterService
  ) { }
  private _formatErrors(error: any) {
    const toastData: toastData = {
      message: error.message,
      segmentClass: "toastError",

    }
    this._toasterService.msg.next(toastData);
    return throwError((() => error))
  }
  private _provider$: Subject<StakePoolProvider> = new Subject();
  public provider$: Observable<StakePoolProvider> = this._provider$.asObservable().pipe(shareReplay(), this._utilService.isNotNull)
  public currentProvider
  public marinadeSDK: Marinade;
  public stakePoolSDK = StakePoolSDK;
  // avaliable stake pool providers to select
  public providers: StakePoolProvider[] = [{
    name: 'Marinade',
    image: 'assets/images/icons/marinade-logo-small.svg',
    mintAddress: 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So',
    ticker: 'mSOL'
  },
  {
    name: 'SolBlaze',
    image: 'assets/images/icons/solblaze-logo.png',
    poolpubkey: new PublicKey(environment.solblazepool),
    mintAddress: 'bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1',
    ticker: 'bSOL'
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
  public selectProvider(provider: StakePoolProvider) {
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
