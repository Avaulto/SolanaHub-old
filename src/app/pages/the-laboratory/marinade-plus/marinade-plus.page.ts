import { Component, OnInit } from '@angular/core';
import { StakePoolStoreService } from '../../defi/dapps/liquid-stake/stake-pool-store.service';
import { ApiService, JupiterStoreService, SolanaUtilsService, TxInterceptService } from 'src/app/services';
import { Observable, firstValueFrom, shareReplay, switchMap } from 'rxjs';
import { DefiStat, WalletExtended } from 'src/app/models';
import bn from 'bn.js'
import { LAMPORTS_PER_SOL, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LaboratoryStoreService } from '../laboratory-store.service';
@Component({
  selector: 'app-marinade-plus',
  templateUrl: './marinade-plus.page.html',
  styleUrls: ['./marinade-plus.page.scss'],
})
export class MarinadePlusPage implements OnInit {
  public menu: string[] = ['deposit', 'withdraw', 'claim'];
  public currentTab: string = this.menu[0]
  strategyStats: DefiStat[] = [
    {
      title:'YOUR BALANCE',
      loading: false,
      desc:'~ 2 SOL'
    },
    {
      title:'YOUR REWARDS',
      loading: false,
      desc:'~ 2 SOL'
    },
    {
      title:'projected APY',
      loading: false,
      desc:'7.1%'
    },
    {
      title:'TVL',
      loading: false,
      desc:'257,879'
    },

  ]
  public depositForm: FormGroup;
  public formSubmitted: boolean = false;
  protected avaultoVoteKey = new PublicKey('7K8DVxtNJGnMtUY1CQJT5jcs8sFGSZTDiG7kowvFpECh');
  constructor(
    private _stakePoolStore: StakePoolStoreService,
    private _solanaUtilsService: SolanaUtilsService,
    private _fb: FormBuilder,
    private _lab: LaboratoryStoreService,
    private _txInterceptService: TxInterceptService,
    private _apiService:ApiService
  ) { }
  public walletExtended$: Observable<WalletExtended> = this._solanaUtilsService.walletExtended$.pipe(
    // accountStateChange used as trigger for re-render wallet related context
    switchMap(async (wallet) => {
      if (wallet) {
        this._stakePoolStore.initMarinade(wallet);
        this._lab.initSolendMarket(wallet)
        return wallet;
      } else {

        return null
      }

    }), shareReplay(),
  )
  ngOnInit() {
    this.depositForm = this._fb.group({
      amount: ['', [Validators.required]]
    })
    // console.log(this._lab.initSolendMarket())
  }

  // steps
  // 1 deposit sol to msol
  // deposit msol to solend

  async submit() {
    let { amount } = this.depositForm.value;
    const wallet = this._solanaUtilsService.getCurrentWallet();
    const sol = new bn((amount - 0.001) * LAMPORTS_PER_SOL);
    const { transaction } = await this._stakePoolStore.marinadeSDK.deposit(sol, { directToValidatorVoteAddress: this.avaultoVoteKey });
    
    await this._txInterceptService.sendTx([transaction], wallet.publicKey)
    
    const assetRatio = await firstValueFrom(this._apiService.get('https://api.marinade.finance/msol/price_sol'))
    const msol = new bn(((amount- 0.001) * 0.99) / assetRatio * LAMPORTS_PER_SOL); 
    const { preLendingTxn, lendingTxn, postLendingTxn } = await (await this._lab.depositMsol(msol, wallet.publicKey)).getTransactions()
        // Execute the transactions
        const arrayOfTx: Transaction[] = []
        for (let transaction of [preLendingTxn, lendingTxn, postLendingTxn].filter(Boolean)) {
          if (!transaction) {
            continue;
          }
          arrayOfTx.push(transaction)
        }
    await this._txInterceptService.sendTx([...arrayOfTx], wallet.publicKey)
  }
}
