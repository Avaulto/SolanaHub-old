import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent  implements OnInit {
  @Input() index
  constructor() { }

  ngOnInit() {}
  public randomNum = Math.floor(Math.random() * 100);
}
