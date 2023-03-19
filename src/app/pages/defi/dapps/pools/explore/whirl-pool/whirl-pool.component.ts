import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WalletStore } from '@heavy-duty/wallet-adapter';

import { PublicKey } from '@solana/web3.js';
import {
  WhirlpoolContext, buildWhirlpoolClient, ORCA_WHIRLPOOL_PROGRAM_ID,
  PDAUtil, PriceMath, PoolUtil, AccountFetcher, WhirlpoolClient
} from "@orca-so/whirlpools-sdk";
import { MintLayout, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { DecimalUtil, MathUtil } from "@orca-so/common-sdk";
import Decimal from 'decimal.js';
import { OrcaStoreService } from '../../orca-store.service';
import { Whirlpool } from '../../orca.model';
import { JupiterStoreService } from 'src/app/services';
import { Token } from 'src/app/models';

interface Reward {
  icon: string,
  symbol: string;
  amount: string;
  toolTip: string;
}
@Component({
  selector: 'app-whirl-pool',
  templateUrl: './whirl-pool.component.html',
  styleUrls: ['./whirl-pool.component.scss'],
})
export class WhirlPoolComponent implements OnInit {
  @Input() pool: Whirlpool;
  @Input() tokenList: Token[];
  readonly isReady$ = this._walletStore.connected$;
  @Output() poolLoaded: EventEmitter<Whirlpool> = new EventEmitter();
  @Output() onInitDeposit: EventEmitter<Whirlpool> = new EventEmitter();
  public poolRewrad: Reward[] = []
  constructor(
    private _walletStore: WalletStore,
    private _orcaStoreService: OrcaStoreService,
    private _jupiterStoreService: JupiterStoreService
  ) { }

  ngOnInit() {

    // this.poolLoaded.emit(this.pool)
    
  }
  // async getPoolReward(pool: Whirlpool) {
  //   const ctx = this._orcaStoreService.orcaContext
  //   const client = this._orcaStoreService.orcaClient;
  //   // const STSOL_USDC_64_WHIRLPOOL = pool.address new PublicKey( pool.address);

  //   const whirlpool_pubkey = new PublicKey(pool.address); //STSOL_USDC_64_WHIRLPOOL;
  //   console.log("whirlpool_key", whirlpool_pubkey.toBase58(), pool);

  //   const whirlpool = await client.getPool(whirlpool_pubkey);
  //   const whirlpool_data = whirlpool.getData()
    
  //   for (let i = 0; i < 3; i++) {
  //     const icon = this.tokenList.find(icon => icon.address === whirlpool_data.rewardInfos[i].mint.toBase58())
  //     if (PoolUtil.isRewardInitialized(whirlpool_data.rewardInfos[i])) {
  //       const mint_account_info = await ctx.connection.getAccountInfo(whirlpool_data.rewardInfos[i].mint);
  //       const mint = MintLayout.decode(mint_account_info.data.slice(0, MintLayout.span));
  //       const decimals = mint.decimals;
  //       console.log(`reward[${i}] mint`, whirlpool_data.rewardInfos[i].mint.toBase58());
  //       // console.log(`reward[${i}] decimals`, decimals);
  //       // console.log(`reward[${i}] vault`, whirlpool_data.rewardInfos[i].vault.toBase58());
  //       // console.log(`reward[${i}] authority`, whirlpool_data.rewardInfos[i].authority.toBase58());
  //       // console.log(`reward[${i}] growthGlobal`, whirlpool_data.rewardInfos[i].growthGlobalX64.toString());
  //       // console.log(`reward[${i}] * emissionsPerSecond`, whirlpool_data.rewardInfos[i].emissionsPerSecondX64.toString());

  //       const emissionsPerWeek = new Decimal(whirlpool_data.rewardInfos[i].emissionsPerSecondX64.toString())
  //         .div(new Decimal(2).pow(64))
  //         .mul(60 * 60 * 24 * 7)
  //         .div(new Decimal(10 ** decimals))
  //         .ceil();
 
  //         if(Number(emissionsPerWeek) > 0){
  //           this.poolRewrad.push({ symbol: icon.symbol, icon: icon.logoURI, amount: emissionsPerWeek.toString(), toolTip: ` ${emissionsPerWeek.toString()}${icon.symbol} reward per week` })
  //         }
  //       console.log(`reward[${i}] * emissionsPerWeek`, emissionsPerWeek.toString(), this.poolRewrad);
  //     }
  //     else {
  //       console.log('no pda util')
  //       // console.log(`reward[${i}] UNINITIALIZED`);
  //       // console.log(`reward[${i}] mint`, whirlpool_data.rewardInfos[i].mint.toBase58());
  //       // console.log(`reward[${i}] vault`, whirlpool_data.rewardInfos[i].vault.toBase58());
  //       // console.log(`reward[${i}] authority`, whirlpool_data.rewardInfos[i].authority.toBase58());
  //       // console.log(`reward[${i}] growthGlobal`, whirlpool_data.rewardInfos[i].growthGlobalX64.toString());
        
  //       console.log(`reward[${i}] * emissionsPerSecond`, whirlpool_data.rewardInfos[i].emissionsPerSecondX64.toString());
  //       if(Number(whirlpool_data.rewardInfos[i].emissionsPerSecondX64.toString()) > 0){
  //         this.poolRewrad.push({ symbol: icon.symbol, icon: icon.logoURI, amount: whirlpool_data.rewardInfos[i].emissionsPerSecondX64.toString(), toolTip: `${whirlpool_data.rewardInfos[i].emissionsPerSecondX64.toString()} ${icon.symbol} per week` })
  //       }
  //     }
  //   }
  // }
}
