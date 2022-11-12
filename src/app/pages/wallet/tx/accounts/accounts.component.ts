import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { BehaviorSubject, shareReplay, Subject } from 'rxjs';
import { Asset, StakeAccountExtended } from 'src/app/models';
import { LoaderService, UtilsService, SolanaUtilsService, TxInterceptService } from 'src/app/services';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountsComponent implements OnInit, OnChanges, OnDestroy {
  // private walletChanged =  this._walletStore.anchorWallet$.pipe(
  //   switchMap(async wallet =>  {
  //     const latestStakeAccounts = await this.getStakeAccount(wallet.publicKey);
  //     this.stakeAccounts$.next(latestStakeAccounts);
  //   }),
  //   distinctUntilChanged()
  // ).subscribe()
  private stakeAccounts: BehaviorSubject<StakeAccountExtended[]> = new BehaviorSubject({} as StakeAccountExtended[]);
  public stakeAccounts$ = this.stakeAccounts.asObservable().pipe(shareReplay(1));
  public initMerge: boolean = false;
  @Input() wallet: Asset;
  constructor(
    public loaderService: LoaderService,
    private _solanaUtilsService: SolanaUtilsService,
    private _txInterceptService: TxInterceptService,
    private _walletStore: WalletStore,
    private _utilsService: UtilsService
  ) { }

  public async ngOnInit(): Promise<void> {
    // automatic update when account has change
    this._updateStakeAccounts(this.wallet.publicKey);
  }
  public async ngOnChanges(changes: SimpleChanges): Promise<void> {
    try {
      const stakeAccounts = await this._getStakeAccount(this.wallet.publicKey);
      this.stakeAccounts.next(stakeAccounts);
    } catch (error) {
      console.warn(error)
    }
  }
  public async deactiveStake(stakeAccount: string): Promise<void> {
    await this._txInterceptService.deactivateStakeAccount(stakeAccount, this.wallet.publicKey);
  }
  public async withdrawStake(stakeAccount: StakeAccountExtended) {
    let stakeBalance = await this._solanaUtilsService.connection.getBalance(new PublicKey(stakeAccount.addr));
    const stakeAccountAddress = stakeAccount.addr
    this._txInterceptService.withdrawStake(stakeAccountAddress, this.wallet.publicKey, stakeBalance)
  }
  private async _getStakeAccount(publicKey: PublicKey): Promise<StakeAccountExtended[]> {
    const stakeAccounts = await this._solanaUtilsService.getStakeAccountsByOwner(publicKey);
    const extendStakeAccount = await stakeAccounts.map(async (acc) => {
      return await this._solanaUtilsService.extendStakeAccount(acc)
    })
    const extendStakeAccountRes = await Promise.all(extendStakeAccount);
    return extendStakeAccountRes;
  }

  public checkForMerge(SA:StakeAccountExtended){
    const stakeAccounts = this.stakeAccounts.value;
    const canMergeAccounts = stakeAccounts.map(account => {
      console.log(account)
      if(account.validatorData.vote_identity == SA.validatorData.vote_identity && account.state == 'active'){
        return account
      }
    });
    this.stakeAccounts.next(canMergeAccounts);
  }
  public async mergeAccounts() {
    const walletOwner = this.wallet.publicKey
    const stakeAccountsSource: PublicKey[] = this.stakeAccounts.value.filter(account => account.checkedForMerge).map(account => new PublicKey(account.addr));
    console.log(walletOwner, stakeAccountsSource,this.stakeAccounts.value)
    this._txInterceptService.mergeStakeAccounts(walletOwner, stakeAccountsSource, stakeAccountsSource[0]);

  }
  private _updateStakeAccounts(publicKey: PublicKey): void {
    this._solanaUtilsService.onAccountChangeCB(publicKey,
      async () => {
        const updatedStakeAccounts = await this._getStakeAccount(publicKey);
        this.stakeAccounts.next(updatedStakeAccounts);
      }
    );
  }

  public ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    // this.walletChanged.unsubscribe();
  }
}
