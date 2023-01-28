import { Component, Input, OnInit } from '@angular/core';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { map, Observable, shareReplay, Subscription, switchMap } from 'rxjs';
import { Asset, ValidatorData } from 'src/app/models';
import { SolanaUtilsService } from 'src/app/services/solana-utils.service';

@Component({
  selector: 'app-tx',
  templateUrl: './tx.component.html',
  styleUrls: ['./tx.component.scss'],
})
export class TxComponent implements OnInit {
  @Input() wallet:Asset;
  public validatorsData: Observable<ValidatorData[] | any> = this._solanaUtilsService.getValidatorData().pipe(
    switchMap(async (validators: ValidatorData | ValidatorData[] | any)=>{
      const fetchMevValidators = await this._solanaUtilsService.fetchMevValidators()
      if(validators.length){
        validators.map(validator=>{
          validator.extraData['support MEV reward'] = fetchMevValidators.find( (mevValidator) => 
          
          mevValidator.vote_account == validator.vote_identity)?.running_jito || false
        })
      }
      return validators
    }),
    shareReplay(),
  )
  public menu: string[] = ['stake', 'accounts', 'send'];
  public currentTab: string = this.menu[0]
  public hasStake: boolean = false;
  public avgApy:number = 0;
  constructor(
    private _solanaUtilsService: SolanaUtilsService,
    ) { }

  ngOnInit() {
    this._solanaUtilsService.getAvgApy().subscribe(avgApy => this.avgApy = avgApy)
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    // this.validatorsData.unsubscribe();
  }
}
