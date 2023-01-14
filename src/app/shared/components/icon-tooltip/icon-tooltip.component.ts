import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-tooltip',
  template: `<ion-icon [tooltip]="tip" placement="top" name="alert-circle-outline"></ion-icon>`,
  styleUrls: ['./icon-tooltip.component.scss'],
})
export class IconTooltipComponent {
  @Input() tip: string;
  constructor() { }


}
