import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { distinctUntilChanged, filter, first, map, mergeMap, Observable, of, Subject, switchMap, takeLast, tap } from 'rxjs';
import { Asset,StakeAccountExtended } from 'src/app/models';
import { LoaderService, UtilsService,SolanaUtilsService ,TxInterceptService} from 'src/app/services';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountsComponent implements OnInit {
  public stakeAccounts: Observable<StakeAccountExtended[]>=  this._walletStore.anchorWallet$.pipe(
    this.utils.isNotNull,
    // tap((wallet) => this.solanaUtilsService.connection.onAccountChange(wallet.publicKey,(res) => this.getStakeAccount(wallet.publicKey) )
    switchMap(async wallet =>  await this.getStakeAccount(wallet.publicKey)),
  )
  @Input() wallet: Asset;
  constructor(
    public loaderService: LoaderService,
    private solanaUtilsService: SolanaUtilsService,
    private txInterceptService: TxInterceptService,
    private _walletStore: WalletStore,
    private utils: UtilsService
  ) { }

  ngOnInit() {
    // this._walletStore.anchorWallet$
    // .pipe(this.utils.isNotNull)
    // .subscribe(async wallet => {
    //   this.getStakeAccount(wallet.publicKey)
    //   this.solanaUtilsService.connection.onAccountChange(wallet.publicKey,(res) => {console.log(res); this.getStakeAccount(wallet.publicKey)});
    // })
  }

  async deactiveStake(stakeAccount: string) {
   await this.txInterceptService.deactivateStakeAccount(stakeAccount, this.wallet.publicKey);
  }
  async withdrawStake(stakeAccount: StakeAccountExtended){
    let stakeBalance = await this.solanaUtilsService.connection.getBalance(new PublicKey(stakeAccount.addr));
    const stakeAccountAddress=stakeAccount.addr
    this.txInterceptService.withdrawStake(stakeAccountAddress,this.wallet.publicKey, stakeBalance)
  }
  private async getStakeAccount(publicKey){
    const stakeAccounts = await this.solanaUtilsService.getStakeAccountsByOwner(publicKey);
    this.solanaUtilsService.onAccountChangeCB(publicKey, (res) => console.log(res));
    
    const extendStakeAccount = await stakeAccounts.map(async (acc) => {
      return await this.solanaUtilsService.extendStakeAccount(acc)
    })
    const extendStakeAccountRes = await Promise.all(extendStakeAccount);
    return extendStakeAccountRes;
  }
}
