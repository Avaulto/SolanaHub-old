import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { StakeAccountExtended } from 'src/app/models';
import { SolanaUtilsService, TxInterceptService } from 'src/app/services';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
})
export class ActionsComponent implements OnInit {
  @Input() account: StakeAccountExtended;
  constructor(private _txInterceptService: TxInterceptService, private _solanaUtilsService: SolanaUtilsService) { }

  ngOnInit() {

  }
  public async deactiveStake(stakeAccount: string): Promise<void> {
    // await this._txInterceptService.deactivateStakeAccount(stakeAccount, this.wallet.publicKey);
  }
  public async withdrawStake(stakeAccount: StakeAccountExtended) {
    // let stakeBalance = await this._solanaUtilsService.connection.getBalance(new PublicKey(stakeAccount.addr));
    const stakeAccountAddress = stakeAccount.addr
    // this._txInterceptService.withdrawStake(stakeAccountAddress, this.wallet.publicKey, stakeBalance)
  }
}
