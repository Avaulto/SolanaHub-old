import { Component, Input, OnInit } from '@angular/core';
import { WalletExtended } from 'src/app/models';

@Component({
  selector: 'app-private-score',
  templateUrl: './private-score.component.html',
  styleUrls: ['./private-score.component.scss'],
})
export class PrivateScoreComponent  implements OnInit {
  @Input() wallet:WalletExtended;
  constructor() { }

  ngOnInit() {}

}
