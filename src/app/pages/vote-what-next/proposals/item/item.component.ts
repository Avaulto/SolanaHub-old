import { Component, Input, OnInit } from '@angular/core';
import { Proposal } from 'src/app/models';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent  implements OnInit {
  @Input() proposal: Proposal;
  constructor() { }

  ngOnInit() {}

}
