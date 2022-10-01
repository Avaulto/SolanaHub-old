import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { WalletConfig, WalletStore, Wallet } from '@heavy-duty/wallet-adapter';
import { Marinade, MarinadeConfig, Provider} from '@marinade.finance/marinade-ts-sdk'
import { MarinadeResult } from '@marinade.finance/marinade-ts-sdk/dist/src/marinade.types';
import { PublicKey, Transaction } from '@solana/web3.js';
import bn from 'bn.js'
import { SolanaUtilsService,TxInterceptService , ToasterService, UtilsService } from 'src/app/services';
import { distinctUntilChanged, filter, firstValueFrom, map, Observable, switchMap, tap } from 'rxjs';
import { toastData,StakeAccountExtended } from 'src/app/models';

import Plausible from 'plausible-tracker'
const { trackEvent } = Plausible();


@Component({
  selector: 'app-stake-account-box',
  templateUrl: './stake-account-box.component.html',
  styleUrls: ['./stake-account-box.component.scss'],
})
export class StakeAccountBoxComponent implements OnInit {
  @Input() marinadeInfo: {msolRatio};
  @Input() marinade: Marinade;
  @Input() stakeAccounts: Observable<StakeAccountExtended[]>
  public selectedStakeAccount: StakeAccountExtended;
  public showAccountList: boolean = false;
  // public stakeAccounts: Observable<StakeAccountExtended[]> = this._walletStore.anchorWallet$.pipe(
  //   tap(wallet => wallet ? wallet : null),
  //   switchMap(async (wallet) => {
      
  //     const stakeAccounts = await this._solanaUtilsService.getStakeAccountsByOwner(wallet.publicKey);
  //     const extendStakeAccount = await stakeAccounts.map(async (acc) => {
  //       const {shortAddr,addr, balance,state} = await this._solanaUtilsService.extendStakeAccount(acc)
  //       let selectable: boolean = false;
  //       // remove account that have less then 2sol - marinade program not support
  //       if(balance > 1 && state == 'active'){
  //         selectable = true
  //       }
  //       console.log(selectable)
  //       return { name: shortAddr, addr, selectable, extraData: {balance, state, selectable} };
  //     })
  //     const extendStakeAccountRes = await Promise.all(extendStakeAccount);
  //     return extendStakeAccountRes;
  //   }),
  //   // filter((res: any[]) => res.filter(item => item.balance > 2)),
  //   distinctUntilChanged()
  // )
  constructor(
    private _solanaUtilsService: SolanaUtilsService,
    private _txInterceptService: TxInterceptService,
    private _walletStore: WalletStore,
    private toasterService:ToasterService
  ) { }


  ngOnInit() {

  }
  setSelectedStakeAccount(stakeAccount:StakeAccountExtended) {
    
    this.selectedStakeAccount = stakeAccount;
    this.showAccountList = !this.showAccountList

  }
  async delegateStakeAccount(){
    trackEvent('marinade stake')
    // get walletOwner
    const walletOwner = await (await firstValueFrom(this._walletStore.anchorWallet$)).publicKey;

    const accountPK = new PublicKey(this.selectedStakeAccount.addr)
    try {
      const depositAccount: MarinadeResult.DepositStakeAccount = await this.marinade.depositStakeAccount(accountPK);
      const txIns: Transaction = depositAccount.transaction
      const res = await this._txInterceptService.sendTx([txIns], walletOwner);
      
    } catch (error) {
      const toasterMessage: toastData = {
        message: error.toString().substring(6),      
        icon:'alert-circle-outline',
      segmentClass: "merinadeErr"}
      this.toasterService.msg.next(toasterMessage)
    }
  }
}
