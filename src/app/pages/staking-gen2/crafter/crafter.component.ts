import { Component, Input, OnInit } from '@angular/core';
import { WalletExtended } from 'src/app/models';

@Component({
  selector: 'app-crafter',
  templateUrl: './crafter.component.html',
  styleUrls: ['./crafter.component.scss'],
})
export class CrafterComponent  implements OnInit {
  @Input() wallet: WalletExtended = null;
  constructor() { }

  ngOnInit() {}

}
