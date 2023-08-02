import { Component, Input, OnInit } from '@angular/core';
import { WalletExtended } from 'src/app/models';
import { MarinadePlusService } from '../../strategies-builder/marinade-plus.service';

@Component({
  selector: 'app-claim',
  templateUrl: './claim.component.html',
  styleUrls: ['./claim.component.scss'],
})
export class ClaimComponent  implements OnInit {
  @Input() walletExtended$: WalletExtended;
  @Input() claimAsset: {amount: number, name: string};
  public swapToSol: boolean = false;
  constructor(private _marinadePlusService:MarinadePlusService) { }

  ngOnInit() {}
  public updateSelection(ev): void{
    this.swapToSol = ev.detail.checked
  }
  public claimReward(): void{
    this._marinadePlusService.claimMNDE(this.walletExtended$,this.swapToSol)
  }
}
