import { Injectable } from '@angular/core';

import { SolanaUtilsService, TxInterceptService, UtilsService } from 'src/app/services';



@Injectable({
  providedIn: 'root'
})
export class StakingGen2Service {
  // private umi: Umi

  constructor(
    private _solanaUtilsService: SolanaUtilsService, 
    private _utilsService: UtilsService,
     private _txInterceptService:TxInterceptService
     ) {
    // Use the RPC endpoint of your choice.
    // this.umi = createUmi(environment.solanaCluster).use(mplCandyMachine());

  }

  async mint() {
    // const nftMint = generateSigner(this.umi);
    // const wallet:any = this._solanaUtilsService.getCurrentWallet()
    // //collectionMint
    // const collectionMint = publicKey('6pksA9Xn2LjQbNsk1HdARNbmNKJpmGHit5fmeeQf8iYi')
    // // Candy Machine id
    // const candyMachine = publicKey("F4sY7r8gopcbJpiz5eU8KpcRWHXbfrm56c3WAbxeaYnt");
    // // Guard
    // const candyGuard = publicKey('6kKrHEWtBT6Zet9VW3vq1NYNpCEMfpU5SvZvrQstz4Ne')
    // // Authority
    // const collectionUpdateAuthority = publicKey('JPQmr9p2RF3X5TuBXxn6AGcEfcsHp4ehcmzE5Ys7pZD')
    // this.umi.use(walletAdapterIdentity(wallet))
    // try {
    //   const minter = await transactionBuilder()
    //     .add(setComputeUnitLimit(this.umi, { units: 800_000 }))
    //     .add(
    //       mintV2(this.umi, {
    //         candyMachine,
    //         candyGuard,
    //         nftMint,
    //         collectionMint,
    //         collectionUpdateAuthority,
    //         tokenStandard: 4,
    //         mintArgs: {
    //           mintLimit: some({ id: 1, limit: 100 }),
    //         }
    //       })
    //     ).sendAndConfirm(this.umi);
    
        // const res = await this._txInterceptService.sendTx([minter],wallet) 

    }
  }
  

