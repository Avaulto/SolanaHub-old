import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { PopoverController } from '@ionic/angular';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { BehaviorSubject, shareReplay, Subject } from 'rxjs';
import { Asset, StakeAccountExtended } from 'src/app/models';
import { LoaderService, UtilsService, SolanaUtilsService, TxInterceptService } from 'src/app/services';
import { ActionsComponent } from './actions/actions.component';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
  animations: [
    trigger('flyInOut', [
      state('in', style({ transform: 'translateX(55%)' })),
      transition('void => *', [
        style({ transform: 'translateX(100%)' }),
        animate(300)
      ]),
      transition('* => void', [
        animate(300, style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountsComponent implements OnInit, OnChanges {
  public showBtnActions: boolean = false;
  public accountToMerge: StakeAccountExtended[] = [];
  private stakeAccounts: BehaviorSubject<StakeAccountExtended[]> = new BehaviorSubject([] as StakeAccountExtended[]);
  public stakeAccounts$ = this.stakeAccounts.asObservable();
  public stakeAccountStatic = null;
  public initMerge: boolean = false;
  @Input() wallet: Asset;
  constructor(
    public loaderService: LoaderService,
    private _solanaUtilsService: SolanaUtilsService,
    private _txInterceptService: TxInterceptService,
    private _walletStore: WalletStore,
    private _popoverController: PopoverController
  ) { }

  public async ngOnInit(): Promise<void> {
    // automatic update when account has change
    if (this.wallet) {
      this._updateStakeAccounts(this.wallet.publicKey);
    }
  }
  public async ngOnChanges(changes: SimpleChanges): Promise<void> {
    try {
      const stakeAccounts = await this._getStakeAccount(this.wallet.publicKey);
      this.stakeAccountStatic = stakeAccounts
      this.stakeAccounts.next(stakeAccounts);
    } catch (error) {
      console.warn(error)
    }
  }
  public getStatusColor(status: 'active' | 'inactive' | 'activating' | 'deactivating') {
    switch (status) {
      case 'active':
        return '#13CFC6'
        break;
      case 'inactive':
        return '#FE5B5B'
        break;
      case 'activating':
        return '#FBBC05'
        break;
      default:
        return '#FE5B5B'
        break;
    }
  }

  async openStakeAccountActions(e: Event, account: StakeAccountExtended, accounts:StakeAccountExtended[]) {
    const popover = await this._popoverController.create({
      component: ActionsComponent,
      componentProps:{account,wallet:this.wallet, accounts},
      event: e,
      alignment: 'start',
      showBackdrop:false,
      backdropDismiss: true,
      dismissOnSelect: true,
      cssClass: 'stake-account-actions-popup',
    });
    await popover.present();
  }

  private async _getStakeAccount(publicKey: PublicKey): Promise<StakeAccountExtended[]> {
    const stakeAccounts = await this._solanaUtilsService.getStakeAccountsByOwner(publicKey);
    const extendStakeAccount = await stakeAccounts.map(async (acc) => {
      return await this._solanaUtilsService.extendStakeAccount(acc)
    })
    const extendStakeAccountRes = await Promise.all(extendStakeAccount);
    return extendStakeAccountRes;
  }

  private _updateStakeAccounts(publicKey: PublicKey): void {
    this._solanaUtilsService.onAccountChangeCB(publicKey,
      async () => {
        const updatedStakeAccounts = await this._getStakeAccount(publicKey);
        this.stakeAccounts.next(updatedStakeAccounts);
      }
    );
  }

}
