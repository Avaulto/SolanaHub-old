import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SolendObligation, SolendReserve } from '@solendprotocol/solend-sdk';
import { SolanaUtilsService, UtilsService } from 'src/app/services';
import { SolendStoreService } from '../solend-store.service';
import { BN } from '@marinade.finance/marinade-ts-sdk';
import { PopoverController } from '@ionic/angular';
import { Pool } from '../solend.model';
import { PortfolioService } from 'src/app/pages/dashboard2/portfolio.service';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-actions-popup',
  templateUrl: './actions-popup.component.html',
  styleUrls: ['./actions-popup.component.scss'],
})
export class ActionsPopupComponent implements OnInit {
  @Input() asset: Pool;
  @Input() popupType: 'supply' | 'borrow' | 'repay' | 'withdraw' = 'supply';
  public solendActionsForm: FormGroup;
  public formSubmitted: boolean = false;
  constructor(
    private _fb: FormBuilder,
    private _utilsService: UtilsService,
    private _solendStore: SolendStoreService,
    private _solanaUtilsService: SolanaUtilsService,
    private _popoverController: PopoverController,
    private _solanaUtilService:SolanaUtilsService
  ) { }

  async ngOnInit() {
    // this.addObligation()
    this.solendActionsForm = this._fb.group({
      // mintAddress: [this.coin.address, Validators.required],
      amount: ['', [Validators.required]],
      symbol: [this.asset.symbol]
    })
    
    const { loanToValueRatio, borrowFeePercentage, assetPriceUSD } = this._solendStore.getSolendSDK().reserves.find(r => r.stats.mintAddress === this.asset.mintAddress).stats
    this.asset.loanToValueRatio = loanToValueRatio
    this.asset.borrowFeePercentage = borrowFeePercentage
    this.asset.assetPriceUSD = assetPriceUSD

    if(this.popupType === 'supply'){
      const { publicKey, balance } = this._solanaUtilsService.getCurrentWallet()
      let tokenBalance  = 0
      if(this.asset.symbol.toLowerCase() === 'sol'){
        tokenBalance = balance
      }else{
        tokenBalance = (await this._solanaUtilService.getTokenAccountsBalance(publicKey.toBase58(), 'token')).find(t => t.mintAddress === this.asset.mintAddress).balance || 0;
      }
      this.asset.balance = tokenBalance
      // const tokensBalance = (await firstValueFrom(this._portfolioService.getPortfolio(publicKey.toBase58()))).filter(group => group.platformId === 'wallet-tokens')[0]
      
    }
    if (this.popupType === 'repay') {
      const res = await this.addObligation()
      const pool = res.borrows.filter(b => b.mintAddress == this.asset.mintAddress)[0]
      this.asset.balance = Number(pool.amount.toString()) / 10 ** this.asset.decimals
      // this.asset.borrowFeePercentage = res
      // this.asset.maxBorrow = res.obligationStats.
      
    }
    if(this.popupType === 'borrow'){
      const res = await this.addObligation()
      // const pool = res.borrows.filter(b => b.mintAddress == this.asset.mintAddress)[0]
      // max borrow
      const maxBorrow = res.obligationStats.borrowLimit * (1 - res.obligationStats.borrowUtilization) / this.asset.assetPriceUSD
      this.asset.balance = maxBorrow

    }

 
  }

  async addObligation() {
    const { publicKey } = this._solanaUtilsService.getCurrentWallet()
    const obligation = await this._solendStore.getSolendSDK().fetchObligationByWallet(publicKey);
    return obligation
    // this.pool.extraData = obligation
    // console.log(this.pool)
  }
  setMaxAmount() {
    const fixedAmount = this._utilsService.shortenNum(this.asset.balance)
    this.solendActionsForm.controls.amount.setValue(fixedAmount);
    
  }
  formatNumber = n => {
    return this._utilsService.formatBigNumbers(n);
  };

  async submit(solendType: 'supply' | 'borrow' | 'repay' | 'withdraw') {
    const { amount, symbol } = this.solendActionsForm.value;
    const { publicKey } = this._solanaUtilsService.getCurrentWallet()
    const amountBn = new BN(amount * 10 ** this.asset.decimals);
    this.formSubmitted = true;
    // do solend action
    switch (solendType) {
      case 'supply':
        await this._solendStore.supplyTx(amountBn, symbol, publicKey)
        break;
      case 'borrow':
        await this._solendStore.borrowTx(amountBn, symbol, publicKey)
        break;
      case 'repay':
        await this._solendStore.repayTx(amountBn, symbol, publicKey)
        break;
      case 'withdraw':
        await this._solendStore.withdrawTx(amountBn, symbol, publicKey)
        break;
    }
    this.formSubmitted = false;
    this._popoverController.dismiss()
  }

}
