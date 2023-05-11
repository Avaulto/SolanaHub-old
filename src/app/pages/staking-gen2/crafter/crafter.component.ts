import { Component, Input, OnInit } from '@angular/core';
import { WalletExtended } from 'src/app/models';
import { StakingGen2Service } from '../staking-gen2.service';

@Component({
  selector: 'app-crafter',
  templateUrl: './crafter.component.html',
  styleUrls: ['./crafter.component.scss'],
})
export class CrafterComponent  implements OnInit {
  @Input() wallet: WalletExtended = null;
  public relayer: 'new-stake' | 'active-stake' = 'new-stake'
  constructor(private _stakingGen2Service:StakingGen2Service) { }

  ngOnInit() {}

  selectRelayer(type: 'new-stake' | 'active-stake'){
    this.relayer = type;
  }
  setMaxAmountSOL() {
    // this.stakeForm.controls.stakeAmount.setValue(this._utilsService.shortenNum(this.solBalance -  0.001));
  }
  public mint(){
    this._stakingGen2Service.mint();
  }
}
