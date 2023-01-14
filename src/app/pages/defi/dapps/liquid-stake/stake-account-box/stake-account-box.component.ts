import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { WalletConfig, WalletStore, Wallet } from '@heavy-duty/wallet-adapter';
import { Marinade, MarinadeConfig, Provider } from '@marinade.finance/marinade-ts-sdk'
import { MarinadeResult } from '@marinade.finance/marinade-ts-sdk/dist/src/marinade.types';
import { PublicKey, Transaction } from '@solana/web3.js';
import bn from 'bn.js'
import { SolanaUtilsService, TxInterceptService, ToasterService, UtilsService } from 'src/app/services';
import { distinctUntilChanged, filter, firstValueFrom, map, Observable, switchMap, tap } from 'rxjs';
import { toastData, StakeAccountExtended } from 'src/app/models';

import Plausible from 'plausible-tracker'
import { StakePoolProvider, StakePoolStats } from '../stake-pool.model';
import { depositStake } from '@solana/spl-stake-pool';
const { trackEvent } = Plausible();


@Component({
  selector: 'app-stake-account-box',
  templateUrl: './stake-account-box.component.html',
  styleUrls: ['./stake-account-box.component.scss'],
})
export class StakeAccountBoxComponent implements OnInit {
  @Input() selectedProvider: StakePoolProvider;
  @Input() stakePoolStats: StakePoolStats;
  @Input() marinade: Marinade;
  @Input() stakeAccounts: Observable<StakeAccountExtended[]>
  public selectedStakeAccount: StakeAccountExtended;
  public showAccountList: boolean = false;

  constructor(
    private _solanaUtilsService: SolanaUtilsService,
    private _txInterceptService: TxInterceptService,
    private _walletStore: WalletStore,
    private toasterService: ToasterService
  ) { }


  ngOnInit() {

  }
  setSelectedStakeAccount(stakeAccount: StakeAccountExtended) {

    this.selectedStakeAccount = stakeAccount;
    this.showAccountList = !this.showAccountList

  }
  async delegateStakeAccount() {
    trackEvent('delegate stake account stake')
    // get walletOwner
    const walletOwner = await (await firstValueFrom(this._walletStore.anchorWallet$)).publicKey;
    const accountPK = new PublicKey(this.selectedStakeAccount.addr);
    try {
      if (this.selectedProvider.name.toLowerCase() == 'marinade') {
        const depositAccount: MarinadeResult.DepositStakeAccount = await this.marinade.depositStakeAccount(accountPK);
        const txIns: Transaction = depositAccount.transaction
        await this._txInterceptService.sendTx([txIns], walletOwner);
      } else {
        const validator = new PublicKey(this.selectedStakeAccount.validatorData.vote_identity)
        let depositTx = await depositStake(
          this._solanaUtilsService.connection,
          this.selectedProvider.poolpubkey,
          walletOwner,
          validator,
          accountPK
        );
        await this._txInterceptService.sendTx(depositTx.instructions, walletOwner, depositTx.signers);

      }
    } catch (error) {
      const toasterMessage: toastData = {
        message: error.toString().substring(6),
        icon: 'alert-circle-outline',
        segmentClass: "merinadeErr"
      }
      this.toasterService.msg.next(toasterMessage)
    }
  }
}
