import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Asset } from 'src/app/models';
import { LoaderService } from 'src/app/services';
import { SolanaUtilsService } from 'src/app/services/solana-utils.service';
import { TxInterceptService } from 'src/app/services/txIntercept.service';
import { StakeAccountExtended } from 'src/app/shared/models/stakeAccountData.model';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountsComponent implements OnInit {
   stakeAccounts: StakeAccountExtended[] = []
  @Input() wallet:Asset;
  constructor(
    public loaderService: LoaderService,
    private solanaUtilsService: SolanaUtilsService,
    private txInterceptService: TxInterceptService,
    ) { }

  ngOnInit() {
    this.loaderService.isLoading.subscribe(val => console.log(val))
    // console.log(this.loaderService.isLoading)
    this.solanaUtilsService.validatorsData.subscribe(async validatorData =>{
      if(validatorData){
        this.stakeAccounts = await this.solanaUtilsService.getStakeAccountsByOwner(this.wallet.publicKey)
      }
    })
  }

  deactiveStake(stakeAccount: string){
    this.txInterceptService.deactivateStakeAccount(stakeAccount,this.wallet.publicKey)
  }
}
