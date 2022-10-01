import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { WalletConfig, WalletStore, Wallet } from '@heavy-duty/wallet-adapter';
import { Marinade, MarinadeConfig, Provider } from '@marinade.finance/marinade-ts-sdk'
import { LAMPORTS_PER_SOL, PublicKey, Transaction } from '@solana/web3.js';
import { SolanaUtilsService ,TxInterceptService, UtilsService} from 'src/app/services';
import bn from 'bn.js'

import Plausible from 'plausible-tracker'
const { trackEvent } = Plausible();


@Component({
  selector: 'app-stake-sol-box',
  templateUrl: './stake-sol-box.component.html',
  styleUrls: ['./stake-sol-box.component.scss'],
})
export class StakeSolBoxComponent implements OnInit {
  @Input() marinade: Marinade;
  @Input() marinadeInfo;
  formSubmitted: boolean = false;
  stakeAmount: number;
  unStakeAmount: number;
  public segmentUtilTab: string = 'stake'
  public wallet;
  public solBalance: number = 0;
  public mSOLBalance: number = 0;
  constructor(
    private _solanaUtilsService: SolanaUtilsService,
    private _txInterceptService: TxInterceptService,
    private _walletStore: WalletStore,
    private _utilsService: UtilsService
  ) { }

  async ngOnInit() {
    this._walletStore.anchorWallet$.subscribe(async wallet => {
      if (wallet) {
        this.wallet = wallet;
        this.solBalance = this._utilsService.shortenNum(((await this._solanaUtilsService.connection.getBalance(this.wallet.publicKey)) / LAMPORTS_PER_SOL));
        const splAccounts = await this._solanaUtilsService.getTokenAccountsBalance(this.wallet.publicKey) || [];
        const marinadeSPL = "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So";
        const msolAccount = splAccounts.find(account => account.mintAddress == marinadeSPL);
        if(msolAccount){
          this.mSOLBalance = msolAccount?.balance < 0.01 ? 0 : msolAccount.balance;
        }else{
          this.mSOLBalance = 0;
        }
      }
    })
  }
  setUtil(util: string) {
    this.segmentUtilTab = util;
  }
  setMaxAmountSOL() {
    this.stakeAmount = this._utilsService.shortenNum(this.solBalance - 0.0001);
    // console.log(this.stakeAmount, this.solBalance)
  }
  setMaxAmountMSOL() {
    this.unStakeAmount = this.mSOLBalance;
  }
  async liquidStake() {
    trackEvent('marinade stake')

    const amount: number = Number(this.stakeAmount);
    const sol = new bn(amount * LAMPORTS_PER_SOL);

    const {
      associatedMSolTokenAccountAddress,
      transaction,
    } = await this.marinade.deposit(sol);
    this._txInterceptService.sendTx([transaction], this.wallet.publicKey)
    // console.log(signature)
  }
  public async liquidUnstake() {
    const sol = new bn(this.unStakeAmount * LAMPORTS_PER_SOL);
    const {
      associatedMSolTokenAccountAddress,
      transaction,
    } = await this.marinade.liquidUnstake(sol)
    // sign and send the `transaction`
    this._txInterceptService.sendTx([transaction], this.wallet.publicKey)
  }
}
