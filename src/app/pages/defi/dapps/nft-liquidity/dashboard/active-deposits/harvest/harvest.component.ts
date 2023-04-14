import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { io } from "socket.io-client";
import { SolanaUtilsService, TxInterceptService } from 'src/app/services';
import { PoolIO, UserDeposit } from '../../../frakt.model';
import { FraktStoreService } from '../../../frakt-store.service';
import { TransactionInstruction } from '@solana/web3.js';
@Component({
  selector: 'app-harvest',
  templateUrl: './harvest.component.html',
  styleUrls: ['./harvest.component.scss'],
})
export class HarvestComponent  implements OnChanges {
  @Input() loans: PoolIO[] = [];
  constructor(
    private _txInterceptService: TxInterceptService,
    private _solanaUtilsService:SolanaUtilsService,
     private _fraktStoreService: FraktStoreService) { }
  public harvestReward: number = 0;
  public poolsToFetchRewards: string[] = [];
  ngOnChanges() {
    this.getHarvestingInfo()
  }

  getHarvestingInfo(){
        this.loans.map(loan =>{
          const userDeposit = loan.userDeposit
          if(userDeposit && userDeposit.harvestAmount > 0.001){
            this.harvestReward += userDeposit.harvestAmount;
            this.poolsToFetchRewards.push(loan.pubkey );
          }
          
        })
  }
  public async harvest():Promise<void> {
    try {
      const walletOwner = this._solanaUtilsService.getCurrentWallet().publicKey
      const harvest_ix: TransactionInstruction[] = await Promise.all(this.poolsToFetchRewards.map(async pool =>
        await this._fraktStoreService.harvestRewards(walletOwner, pool)
      ))
      await this._txInterceptService.sendTx(harvest_ix, walletOwner)
    } catch (error) {
      console.warn(error)
    }
  }
}
