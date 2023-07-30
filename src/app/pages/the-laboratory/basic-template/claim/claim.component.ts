import { Component, Input, OnInit } from '@angular/core';
import { WalletExtended } from 'src/app/models';

@Component({
  selector: 'app-claim',
  templateUrl: './claim.component.html',
  styleUrls: ['./claim.component.scss'],
})
export class ClaimComponent  implements OnInit {
  @Input() walletExtended$: WalletExtended;
  @Input() claimAsset: {amount: number, name: string};
  constructor() { }

  ngOnInit() {}
  claimReward(){

  }
}
