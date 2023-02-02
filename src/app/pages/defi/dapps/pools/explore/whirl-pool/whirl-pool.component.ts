import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { Whirlpool } from '../../orca.model';
interface WhirlPoolView {

}
@Component({
  selector: 'app-whirl-pool',
  templateUrl: './whirl-pool.component.html',
  styleUrls: ['./whirl-pool.component.scss'],
})
export class WhirlPoolComponent implements OnInit {
  @Input() pool: Whirlpool;
  readonly isReady$ = this._walletStore.connected$;
  @Output() poolLoaded: EventEmitter<Whirlpool> = new EventEmitter();
  @Output() onInitDeposit: EventEmitter<Whirlpool> = new EventEmitter();
  constructor(private _walletStore: WalletStore) { }

  ngOnInit() {
    // this.poolLoaded.emit(this.pool)
  }
}
