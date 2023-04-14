import { Component, Input, OnInit } from '@angular/core';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { UtilsService } from 'src/app/services';
import { environment } from 'src/environments/environment';
import { BestBorrowSuggtion, OpenLoan } from '../frakt.model';
interface AggrigateNft {
  name:string;
  imageUrl: string;
  mint:string;
  customTitle: string;
  customeValue: string;
  extraData: any;
}
@Component({
  selector: 'app-collateral-nft',
  templateUrl: './collateral-nft.component.html',
  styleUrls: ['./collateral-nft.component.scss'],
})
export class CollateralNftComponent  implements OnInit {
  @Input() nft: BestBorrowSuggtion | OpenLoan | any
  @Input() type: 'borrow' | 'openLoan'
  public aggrigateNft: AggrigateNft = {name: null, imageUrl: null, mint:null,customTitle:null, customeValue:null,extraData: {}};
  public LAMPORTS_PER_SOL = LAMPORTS_PER_SOL
  public env = environment.solanaEnv
  constructor(public utilsService: UtilsService) { }

  ngOnInit() {
    // this.aggrigateNft.name = this.nft
    if(this.type == 'borrow'){
     this.aggrigateNft.name = this.nft.name;
     this.aggrigateNft.mint = this.nft.mint
     this.aggrigateNft.imageUrl = this.nft.imageUrl;
     this.aggrigateNft.customTitle = 'to borrow';
     this.aggrigateNft.customeValue =  Number(this.nft.classicParams.maxLoanValue / LAMPORTS_PER_SOL).toFixedNoRounding(3) + ' ◎'
     this.aggrigateNft.extraData = {
      'liquidity Pool Pubkey': this.utilsService.addrUtil(this.nft.classicParams.timeBased.liquidityPoolPubkey).addrShort,
      'Return Period Days': this.nft.classicParams.timeBased.returnPeriodDays,
      'LTV Percent':  this.nft.classicParams.timeBased.ltvPercent + '%',
      fee: Number(this.nft.classicParams.timeBased.fee / LAMPORTS_PER_SOL).toFixedNoRounding(4) + ' ◎',
      'fee discount': this.nft.classicParams.timeBased.feeDiscountPercent + '%',
      'loan value':  Number(this.nft.classicParams.timeBased.loanValue / LAMPORTS_PER_SOL).toFixedNoRounding(3) + ' ◎', 
      'replay value': Number(this.nft.classicParams.timeBased.repayValue / LAMPORTS_PER_SOL).toFixedNoRounding(3) + ' ◎'
     }
    }else{
      this.aggrigateNft.name = this.nft.nft.name;
      this.aggrigateNft.mint = this.nft.nft.mint
      this.aggrigateNft.imageUrl = this.nft.nft.imageUrl;
      this.aggrigateNft.customTitle = 'to repay';
      this.aggrigateNft.customeValue = Number(this.nft.repayValue / LAMPORTS_PER_SOL).toFixedNoRounding(3) + ' ◎'
      this.aggrigateNft.extraData = {
       'started at':  new Date(this.nft.startedAt * 1000).toLocaleDateString() + ' ' + new Date(this.nft.startedAt * 1000).toLocaleTimeString(),
      'loan Value': Number(this.nft.loanValue / LAMPORTS_PER_SOL).toFixedNoRounding(3) + ' ◎' ,
       'Loan Type': this.nft.loanType,
      }
      // user: string;
      // pubkey: string;
      // loanType: string;
      // loanValue: number;
      // repayValue: number;
      // startedAt: number;
      // nft: {
      //     mint: string;
      //     name: string;
      //     imageUrl: string;
      //     collectionName: string;
      // }
  
      // classicParams: {
      //     liquidityPool: string;
      //     collectionInfo: string;
      //     royaltyAddress: string;
      //     nftUserTokenAccount: string;
      //     timeBased: {
      //         expiredAt: number;
      //     };
      // }
    }

  }

  selectToBorrow(){}
}
