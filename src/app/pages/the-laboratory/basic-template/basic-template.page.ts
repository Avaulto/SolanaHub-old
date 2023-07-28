import { Component, OnInit } from '@angular/core';
import { StakePoolStoreService } from '../../defi/dapps/liquid-stake/stake-pool-store.service';
import { ApiService, JupiterStoreService, SolanaUtilsService, TxInterceptService } from 'src/app/services';
import { Observable, firstValueFrom, shareReplay, switchMap } from 'rxjs';
import { DefiStat, WalletExtended } from 'src/app/models';
import bn from 'bn.js'
import { LAMPORTS_PER_SOL, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LaboratoryStoreService } from '../laboratory-store.service';
import { MarinadePlusService } from '../strategies-builder/marinade-plus.service';

@Component({
  selector: 'app-basic-template',
  templateUrl: './basic-template.page.html',
  styleUrls: ['./basic-template.page.scss'],
})
export class BasicTemplatePage implements OnInit {
  public menu: string[] = ['deposit', 'withdraw', 'claim'];
  public currentTab: string = this.menu[0]
  public strategyStats: DefiStat[] = this._marinadePlusService.strategyStats;
  public depositForm: FormGroup;
  public formSubmitted: boolean = false;
  protected avaultoVoteKey = new PublicKey('7K8DVxtNJGnMtUY1CQJT5jcs8sFGSZTDiG7kowvFpECh');
  constructor(
    private _stakePoolStore: StakePoolStoreService,
    private _solanaUtilsService: SolanaUtilsService,
    private _fb: FormBuilder,
    // private _lab: LaboratoryStoreService,
    private _txInterceptService: TxInterceptService,
    private _apiService: ApiService,
    private _marinadePlusService: MarinadePlusService
  ) { }
  public walletExtended$: Observable<WalletExtended> = this._solanaUtilsService.walletExtended$.pipe(
    // accountStateChange used as trigger for re-render wallet related context
    switchMap(async (wallet) => {
      if (wallet) {
        await this._stakePoolStore.initMarinade(wallet);
        await this._marinadePlusService.initSolendWallet()
        const deposits = await this._marinadePlusService.getOnwerMsolDeposit();
        this.strategyStats[0].desc = deposits.toFixedNoRounding(3);
        this.strategyStats[0].loading = false;

        const claimedRewards = await this._marinadePlusService.getClaimedRewards();
        this.strategyStats[1].desc = claimedRewards.toFixedNoRounding(3) + ' MNDE';
        this.strategyStats[1].loading = false;

        // const projectedAPY = await this._marinadePlusService.getStrategyAPY();
        // this.strategyStats[2].desc = projectedAPY + '%';
        // this.strategyStats[2].loading = false;
        // this._lab.initSolendMarket(wallet)
        return wallet;
      } else {

        return null
      }

    }), shareReplay(),
  )

  async ionViewWillEnter() {
    this.strategyStats[2].desc = await this._marinadePlusService.getStrategyAPY() + '%'
    this.strategyStats[2].loading = false;

    this.strategyStats[3].desc = await this._marinadePlusService.getTVL()
    this.strategyStats[3].loading = false;

  }
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
    // let { amount } = this.depositForm.value;
    // const wallet = this._solanaUtilsService.getCurrentWallet();
    // const sol = new bn((amount - 0.001) * LAMPORTS_PER_SOL);
    // const { transaction } = await this._stakePoolStore.marinadeSDK.deposit(sol, { directToValidatorVoteAddress: this.avaultoVoteKey });

    // await this._txInterceptService.sendTx([transaction], wallet.publicKey)

    // const assetRatio = await firstValueFrom(this._apiService.get('https://api.marinade.finance/msol/price_sol'))
    // const msol = new bn(((amount- 0.001) * 0.99) / assetRatio * LAMPORTS_PER_SOL); 
    // const { preLendingTxn, lendingTxn, postLendingTxn } = await (await this._lab.depositMsol(msol, wallet.publicKey)).getTransactions()
    //     // Execute the transactions
    //     const arrayOfTx: Transaction[] = []
    //     for (let transaction of [preLendingTxn, lendingTxn, postLendingTxn].filter(Boolean)) {
    //       if (!transaction) {
    //         continue;
    //       }
    //       arrayOfTx.push(transaction)
    //     }
    // await this._txInterceptService.sendTx([...arrayOfTx], wallet.publicKey)
  }

}
