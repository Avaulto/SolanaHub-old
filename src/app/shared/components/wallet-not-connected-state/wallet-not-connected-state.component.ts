import { Component, Input, OnInit } from '@angular/core';
import { faPlugCircleBolt } from '@fortawesome/free-solid-svg-icons';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-wallet-not-connected-state',
  templateUrl: './wallet-not-connected-state.component.html',
  styleUrls: ['./wallet-not-connected-state.component.scss'],
})
export class WalletNotConnectedStateComponent implements OnInit {
  @Input() showBtn: boolean = false;
  @Input() showText: boolean = false;
  @Input() content: any;
  public plugWalletIcon = faPlugCircleBolt;
  readonly isReady$ = this._walletStore.connected$;
  constructor(private _walletStore:WalletStore) { }

  ngOnInit() {}

}
