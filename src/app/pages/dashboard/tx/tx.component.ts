import { Component, Input, OnInit } from '@angular/core';
import { map, Observable, shareReplay, Subscription, switchMap } from 'rxjs';
import { Asset, ValidatorData } from 'src/app/models';
import { SolanaUtilsService } from 'src/app/services/solana-utils.service';

@Component({
  selector: 'app-tx',
  templateUrl: './tx.component.html',
  styleUrls: ['./tx.component.scss'],
})
export class TxComponent implements OnInit {
  // private _marinadeNativeStake:ValidatorData = {
  //   name: 'Marinade Native',
  //   identity: 'stWirqFCf2Uts1JBL1Jsd3r6VBWhgnpdPxCTe1MFjrq',
  //   image:'assets/images/icons/marinade-native-logo.svg',
  //   vote_identity:'stWirqFCf2Uts1JBL1Jsd3r6VBWhgnpdPxCTe1MFjrq',
  //   website:'https://marinade.finance',
  //   wizScore: 100,
  //   commission: 0,
  //   apy_estimate: 7.47,
  //   activated_stake: 2000000, // https://api.marinade.finance/tlv
  //   uptime: 100,
  //   skipRate: 'none',
  //   selectable: true,
  //   extraData:  {
  //     'APY estimate': 7.47 + '%',
  //     commission:  + '%'
  //   }
  // }
  public validatorsData: Observable<ValidatorData[] | any> = this._solanaUtilsService.getValidatorData().pipe(
    switchMap(async (validators: ValidatorData | ValidatorData[] | any)=>{
      const fetchMevValidators = await this._solanaUtilsService.fetchMevValidators()
      if(validators.length){
        validators.map(validator=>{
          validator.extraData['support MEV reward'] = fetchMevValidators.find( (mevValidator) => 
          
          mevValidator.vote_account == validator.vote_identity)?.running_jito || false
        })
        // validators.unshift(this._marinadeNativeStake)
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
