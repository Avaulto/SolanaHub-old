import { Component, Input, OnInit } from '@angular/core';
import { PtsCalcIncludePoolShare } from 'src/app/models/avaulto-loyalty.model';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent  implements OnInit {
  @Input() index;
  @Input() loyaltyScore: PtsCalcIncludePoolShare
  constructor() { }

  ngOnInit() {}
  public randomNum = Math.floor(Math.random() * 100);
}
