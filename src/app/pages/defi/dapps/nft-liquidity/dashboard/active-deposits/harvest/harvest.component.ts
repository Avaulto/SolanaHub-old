import { Component, OnInit } from '@angular/core';
import { io } from "socket.io-client";
import { SolanaUtilsService, TxInterceptService } from 'src/app/services';
import { PoolIO } from '../../../frakt.model';
import { FraktStoreService } from '../../../frakt-store.service';
import { TransactionInstruction } from '@solana/web3.js';
@Component({
  selector: 'app-harvest',
  templateUrl: './harvest.component.html',
  styleUrls: ['./harvest.component.scss'],
})
export class HarvestComponent  implements OnInit {

  constructor(
    private _txInterceptService: TxInterceptService,
    private _solanaUtilsService:SolanaUtilsService,
     private _fraktStoreService: FraktStoreService) { }
  public harvestReward: number = 0;
  public poolsToFetchRewards: string[] = [];
  ngOnInit() {
    this.getHarvestingInfo()
  }

  getHarvestingInfo(){
    const conn = io('wss://api.frakt.xyz',{ transports: ['websocket'] });
      conn.emit('lending-subscribe', this._solanaUtilsService.getCurrentWallet().publicKey.toBase58());
      conn.on('lending', (loans: PoolIO[]) => {
        loans.map(loan =>{
          const userDeposit = loan.userDeposit
          if(userDeposit){
            this.harvestReward += userDeposit.harvestAmount;
            this.poolsToFetchRewards.push(userDeposit.pubkey);
          }
          
        })
        console.log(this.harvestReward)
        conn.close()
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
