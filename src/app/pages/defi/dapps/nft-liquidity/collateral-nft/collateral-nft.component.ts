import { Component, Input, OnInit } from '@angular/core';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { UtilsService } from 'src/app/services';
import { environment } from 'src/environments/environment';
import { BestBorrowSuggtion, OpenLoan } from '../frakt.model';
interface AggrigateNft {
  name:string;
  imgUrl: string;
  mint:string;
  extraData: any 
}
@Component({
  selector: 'app-collateral-nft',
  templateUrl: './collateral-nft.component.html',
  styleUrls: ['./collateral-nft.component.scss'],
})
export class CollateralNftComponent  implements OnInit {
  @Input() nft: BestBorrowSuggtion
  public aggrigateNft: AggrigateNft;
  public LAMPORTS_PER_SOL = LAMPORTS_PER_SOL
  public env = environment.solanaEnv
  constructor(public utilsService: UtilsService) { }

  ngOnInit() {
    // this.aggrigateNft.name = this.nft
   
      this.nft.classicParams.maxLoanValue = this.nft.classicParams.maxLoanValue  / LAMPORTS_PER_SOL
      this.nft.classicParams.timeBased.loanValue = this.nft.classicParams.timeBased.loanValue / LAMPORTS_PER_SOL
      this.nft.classicParams.timeBased.repayValue  = this.nft.classicParams.timeBased.repayValue / LAMPORTS_PER_SOL
      this.nft.classicParams.timeBased.fee = this.nft.classicParams.timeBased.fee / LAMPORTS_PER_SOL

  }

  selectToBorrow(){}
}
