import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiService, SolanaUtilsService, TxInterceptService } from 'src/app/services';
import { PoolIO, UserDeposit } from '../../frakt.model';
import { FraktStoreService } from '../../frakt-store.service';
import { AllUserStats, UserRewards } from '../../frakt.model';

@Component({
  selector: 'app-active-deposits',
  templateUrl: './active-deposits.component.html',
  styleUrls: ['./active-deposits.component.scss'],
})
export class ActiveDepositsComponent  implements OnInit {
  @Output() onSelectTab = new EventEmitter();
  @Input() userStats: AllUserStats;
  public loans: PoolIO[] =[]
  public activePools: {name: string,amount: any}[] = []
  constructor(
    private _solanaUtilsService: SolanaUtilsService,
    private _fraktStoreService: FraktStoreService,
    private _apiService:ApiService
    ) { }

 
  ngOnChanges(): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    this.userStats ?  this.getWeightedApy() : null
  }
  ngOnInit() {
   
  }

  getWeightedApy(){
    this._apiService.get(`http://api.frakt.xyz/liquidity/list?wallet=${this._solanaUtilsService.getCurrentWallet().publicKey.toBase58()}`).subscribe(loans=>{
      this.loans = loans
      loans.map(loan =>{
        if(loan.userDeposit?.depositAmount > 0){
         this.activePools.push({name:loan.name, amount: 'YOUR LIQUIDITY: ' + Number(loan.userDeposit.depositAmount).toFixedNoRounding(2) +' ◎'})
        }
        
      })


    })
  }
}
