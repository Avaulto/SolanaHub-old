import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Asset } from 'src/app/models';
import { TxInterceptService } from 'src/app/services/txIntercept.service';
import { StakeAccountExtended } from 'src/app/shared/models/stakeAccountData.model';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountsComponent implements OnInit,OnChanges {
  @Input() stakeAccounts: StakeAccountExtended[] = []
  @Input() wallet:Asset;
  constructor(private txInterceptService: TxInterceptService) { }

  ngOnInit() {
    console.log(this.stakeAccounts)
  }
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    console.log(this.stakeAccounts,changes)
  }
  deactiveStake(stakeAccount: string){
    this.txInterceptService.deactivateStakeAccount(stakeAccount,this.wallet.publicKey)
  }
}
