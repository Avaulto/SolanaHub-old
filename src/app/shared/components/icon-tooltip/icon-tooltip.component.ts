import { Component, Input } from '@angular/core';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { TooltipPosition, TooltipTheme } from '../tooltip/tooltip.enums';

@Component({
  selector: 'app-icon-tooltip',
  template: `<fa-icon [icon]="infoIcon" [tooltip]="tip" [position]="position" [theme]="theme" placement="top"></fa-icon>`
})
export class IconTooltipComponent {
  @Input() tip: string;
  @Input() position: TooltipPosition = TooltipPosition.DEFAULT;
  @Input() theme: TooltipTheme = TooltipTheme.DEFAULT;
  public infoIcon = faCircleInfo; 
  constructor() { }


}
