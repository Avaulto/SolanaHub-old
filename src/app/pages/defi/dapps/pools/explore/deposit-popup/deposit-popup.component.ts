import { Component, Input, OnInit } from '@angular/core';
import { OrcaStoreService } from '../../orca-store.service';
import { Whirlpool } from '../../orca.model';

@Component({
  selector: 'app-deposit-popup',
  templateUrl: './deposit-popup.component.html',
  styleUrls: ['./deposit-popup.component.scss'],
})
export class DepositPopupComponent  implements OnInit {
  @Input() pool: Whirlpool
  constructor(private _orcaStoreService: OrcaStoreService) { }

  ngOnInit() {}
  addLiquidity(){
    // this._orcaStoreService.addLiquidity(this.pool)
  }
}
