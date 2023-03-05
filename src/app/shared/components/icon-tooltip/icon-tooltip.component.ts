import { Component, Input } from '@angular/core';
import { TooltipPosition, TooltipTheme } from '../tooltip/tooltip.enums';

@Component({
  selector: 'app-icon-tooltip',
  template: `<ion-icon [tooltip]="tip" [position]="position" [theme]="theme" placement="top" name="alert-circle-outline"></ion-icon>`
})
export class IconTooltipComponent {
  @Input() tip: string;
  @Input() position: TooltipPosition = TooltipPosition.DEFAULT;
  @Input() theme: TooltipTheme = TooltipTheme.DEFAULT;
  constructor() { }


}
