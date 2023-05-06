import { Component, Input, OnInit,EventEmitter, Output } from '@angular/core';
import { WalletExtended } from 'src/app/models';

@Component({
  selector: 'app-my-guardian',
  templateUrl: './my-guardian.component.html',
  styleUrls: ['./my-guardian.component.scss'],
})
export class MyGuardianComponent  implements OnInit {
  @Input() wallet: WalletExtended = null;
  @Output() onSelectTab = new EventEmitter();
  constructor() { }

  ngOnInit() {}

}
