import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { switchMap } from 'rxjs';
import { SolanaUtilsService, UtilsService } from 'src/app/services';
import { FraktStoreService } from '../../frakt-store.service';
import { AllUserStats, OpenLoan } from '../../frakt.model';
@Component({
  selector: 'app-active-loans',
  templateUrl: './active-loans.component.html',
  styleUrls: ['./active-loans.component.scss'],
})
export class ActiveLoansComponent implements OnInit {
  @Output() onSelectTab = new EventEmitter();
  @Input() userStats: AllUserStats;
  constructor(
    private _solanaUtilsService: SolanaUtilsService,
    private _utilsService: UtilsService,
    private _fraktStoreService: FraktStoreService
  ) { }
  public collateralNfts$ = this._solanaUtilsService.walletExtended$.pipe(
    switchMap(async wallet => {
      if (wallet) {
        const collateralNfts = await this._fraktStoreService.getOpenLoans(wallet.publicKey.toBase58())
        this.calcLoanTypes(collateralNfts)
        return collateralNfts
      } else {
        return null
      }
    })
  )
  public loansInfo = null;
    
  calcExpiry(unixTime: number) {
    return new Date(unixTime * 1000).toLocaleDateString()// + ' ' + new Date(unixTime * 1000).toLocaleTimeString()
  }
  calcLiquidationPrice(lamports: number) {
    return Number(lamports / LAMPORTS_PER_SOL).toFixedNoRounding(3);
  }
  calcLoanTypes = (collateralNfts: OpenLoan[]) => {
    this.loansInfo = {
      totalBorrowed: 0,
      totalDebt: 0,
      totalFlip: 0,
      totalPerpetual: 0,
    }
      
    collateralNfts.map(collateral => {
      this.loansInfo.totalBorrowed += this.loansInfo.totalBorrowed + collateral.loanValue;
      this.loansInfo.totalDebt += this.loansInfo.totalDebt + collateral.repayValue;
      
      if (collateral.loanType == "timeBased") {
        this.loansInfo.totalFlip +=  this.loansInfo.totalFlip  + collateral.repayValue
      }
      if (collateral.loanType == "priceBased") {
        this.loansInfo.totalPerpetual += this.loansInfo.totalPerpetual + collateral.repayValue
      }
    })
    this.loansInfo.totalBorrowed = Number(this.loansInfo.totalBorrowed / LAMPORTS_PER_SOL).toFixedNoRounding(3)
    this.loansInfo.totalDebt = Number(this.loansInfo.totalDebt / LAMPORTS_PER_SOL).toFixedNoRounding(3)
    this.loansInfo.totalFlip = Number(this.loansInfo.totalFlip / LAMPORTS_PER_SOL).toFixedNoRounding(3)
    this.loansInfo.totalPerpetual = Number(this.loansInfo.totalPerpetual / LAMPORTS_PER_SOL).toFixedNoRounding(3)
  }
  ngOnInit() {

  }
  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1.3,
    centeredSlides: true,
    spaceBetween: 10,
    speed: 400
  };
  repayLoan(nft: OpenLoan) {
    this._fraktStoreService.repayLoan(this._solanaUtilsService.getCurrentWallet().publicKey, nft)
  }
}
