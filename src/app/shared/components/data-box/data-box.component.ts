import { Component, Input, OnInit } from '@angular/core';
import { TooltipPosition } from '../../layouts/tooltip/tooltip.enums';

@Component({
  selector: 'app-data-box',
  templateUrl: './data-box.component.html',
  styleUrls: ['./data-box.component.scss'],
})
export class DataBoxComponent implements OnInit {
  @Input() title: string;
  @Input() desc: any;
  @Input() size: string;
  @Input() loading: any = true;
  @Input() tip?: string;
  @Input() position: TooltipPosition = TooltipPosition.BELOW;
  constructor() { }

  ngOnInit() {
  }

}
