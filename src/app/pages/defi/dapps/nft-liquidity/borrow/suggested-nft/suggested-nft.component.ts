import { Component, Input, OnInit } from '@angular/core';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { UtilsService } from 'src/app/services';
import { environment } from 'src/environments/environment';
import { BestBorrowSuggtion } from '../../frakt.model';

@Component({
  selector: 'app-suggested-nft',
  templateUrl: './suggested-nft.component.html',
  styleUrls: ['./suggested-nft.component.scss'],
})
export class SuggestedNftComponent  implements OnInit {
  @Input() nft: BestBorrowSuggtion;
  public LAMPORTS_PER_SOL = LAMPORTS_PER_SOL
  public env = environment.solanaEnv
  constructor(public utilsService: UtilsService) { }

  ngOnInit() {
    this.nft.classicParams.maxLoanValue = this.nft.classicParams.maxLoanValue  / LAMPORTS_PER_SOL
    this.nft.classicParams.timeBased.loanValue = this.nft.classicParams.timeBased.loanValue / LAMPORTS_PER_SOL
    this.nft.classicParams.timeBased.repayValue  = this.nft.classicParams.timeBased.repayValue / LAMPORTS_PER_SOL
    this.nft.classicParams.timeBased.fee = this.nft.classicParams.timeBased.fee / LAMPORTS_PER_SOL
  }

  selectToBorrow(){}
}
