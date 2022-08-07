import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { distinctUntilChanged, filter, first, map, mergeMap, Observable, of, Subject, switchMap, takeLast, tap } from 'rxjs';
import { Asset } from 'src/app/models';
import { LoaderService, UtilsService } from 'src/app/services';
import { SolanaUtilsService } from 'src/app/services/solana-utils.service';
import { TxInterceptService } from 'src/app/services/txIntercept.service';
import { StakeAccountExtended } from 'src/app/shared/models/stakeAccountData.model';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountsComponent implements OnInit {
  public stakeAccounts: Subject<StakeAccountExtended[]>= new Subject();
  // public stakeAccounts: Observable<StakeAccountExtended[]> =  this._walletStore.anchorWallet$
  // .pipe(
  //   this.utils.isNotNull,
  //   mergeMap(async wallet =>{
  //     console.log(wallet)
  
  //     const stakeAccounts = await this.solanaUtilsService.getStakeAccountsByOwner(wallet.publicKey)
  //     const extendStakeAccount = await stakeAccounts.map(async (acc) => {
  //       return await this.solanaUtilsService.extendStakeAccount(acc)
  //     })
  //     const extendStakeAccountRes = await Promise.all(extendStakeAccount);
  //     return of(extendStakeAccountRes)
  //   }),
  //   // tap(res)
  //   distinctUntilChanged()
  //   )
  @Input() wallet: Asset;
  constructor(
    public loaderService: LoaderService,
    private solanaUtilsService: SolanaUtilsService,
    private txInterceptService: TxInterceptService,
    private _walletStore: WalletStore,
    private utils: UtilsService
  ) { }

  ngOnInit() {
    this._walletStore.anchorWallet$.subscribe(async wallet => {
      console.log(wallet)
    })
    // this.loaderService.isLoading.subscribe(val => console.log(val))
    // console.log(this.loaderService.isLoading)

    this._walletStore.anchorWallet$
    .pipe(this.utils.isNotNull)
    .subscribe(async wallet => {
      const stakeAccounts = await this.solanaUtilsService.getStakeAccountsByOwner(wallet.publicKey)
      const extendStakeAccount = await stakeAccounts.map(async (acc) => {
        return await this.solanaUtilsService.extendStakeAccount(acc)
      })
      const extendStakeAccountRes = await Promise.all(extendStakeAccount);
      this.stakeAccounts.next(extendStakeAccountRes);
    })
  }

  deactiveStake(stakeAccount: string) {
    this.txInterceptService.deactivateStakeAccount(stakeAccount, this.wallet.publicKey)
  }
}
