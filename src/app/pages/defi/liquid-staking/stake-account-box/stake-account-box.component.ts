import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { WalletConfig, WalletStore, Wallet } from '@heavy-duty/wallet-adapter';
import { Marinade, MarinadeConfig, Provider } from '@marinade.finance/marinade-ts-sdk'
import { LAMPORTS_PER_SOL, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import { SolanaUtilsService } from 'src/app/services/solana-utils.service';
import bn from 'bn.js'
import { TxInterceptService } from 'src/app/services/txIntercept.service';
import { ToasterService, UtilsService } from 'src/app/services';
import { StakeAccountExtended } from 'src/app/shared/models/stakeAccountData.model';
import { distinctUntilChanged, filter, map, Observable, switchMap } from 'rxjs';
import { MarinadeResult } from '@marinade.finance/marinade-ts-sdk/dist/src/marinade.types';
import { toastData } from 'src/app/models';
@Component({
  selector: 'app-stake-account-box',
  templateUrl: './stake-account-box.component.html',
  styleUrls: ['./stake-account-box.component.scss'],
})
export class StakeAccountBoxComponent implements OnInit {
  @Input() marinadeInfo: {msolRatio};
  @Input() marinade: Marinade;
  public selectedStakeAccount: StakeAccountExtended;
  public showAccountList: boolean = false;
  public stakeAccounts: Observable<StakeAccountExtended[]> = this._walletStore.anchorWallet$.pipe(
    switchMap(async (wallet) => {
      const stakeAccounts = await this.solanaUtilsService.getStakeAccountsByOwner(wallet.publicKey);
      const extendStakeAccount = await stakeAccounts.map(async (acc) => {
        const {shortAddr,addr, balance,state} = await this.solanaUtilsService.extendStakeAccount(acc)
        let selectable: boolean = false;
        // remove account that have less then 2sol - marinade program not support
        if(balance > 2){
          selectable = true
        }
        return { name: shortAddr, addr, selectable, extraData: {balance, state, selectable} };
      })
      const extendStakeAccountRes = await Promise.all(extendStakeAccount);
      return extendStakeAccountRes;
    }),
    // filter((res: any[]) => res.filter(item => item.balance > 2)),
    distinctUntilChanged()
  )
  constructor(
    private solanaUtilsService: SolanaUtilsService,
    private txInterceptService: TxInterceptService,
    private _walletStore: WalletStore,
    private utilsService: UtilsService,
    private toasterService:ToasterService
  ) { }

  wallet;
  ngOnInit() {
    this._walletStore.anchorWallet$.subscribe(wallet => {
      if (wallet) {
        this.wallet = wallet;
      }
    })
  }
  setSelectedStakeAccount(stakeAccount:StakeAccountExtended) {
    
    this.selectedStakeAccount = stakeAccount;
    this.showAccountList = !this.showAccountList

  }
  async delegateStakeAccount(){
    const accountPK = new PublicKey(this.selectedStakeAccount.addr)
    try {
      const depositAccount: MarinadeResult.DepositStakeAccount = await this.marinade.depositStakeAccount(accountPK);
      const txIns: Transaction = depositAccount.transaction
      const res = await this.txInterceptService.sendTx([txIns], this.wallet.publicKey);
      
    } catch (error) {
      const toasterMessage: toastData = {
        message: error.toString().substring(6),      
        icon:'alert-circle-outline',
      segmentClass: "merinadeErr"}
      this.toasterService.msg.next(toasterMessage)
    }
  }
}
