import { Component, OnInit } from '@angular/core';
import { faPlugCircleBolt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-wallet-not-connected-state',
  templateUrl: './wallet-not-connected-state.component.html',
  styleUrls: ['./wallet-not-connected-state.component.scss'],
})
export class WalletNotConnectedStateComponent implements OnInit {
  public plugWalletIcon = faPlugCircleBolt
  constructor() { }

  ngOnInit() {}

}
