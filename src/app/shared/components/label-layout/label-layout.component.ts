import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-label-layout',
  template: `  <ion-row style="margin-bottom:8px" class="heading-6 ion-justify-content-between">
                <div id="">{{layoutConfig.title}} <app-icon-tooltip *ngIf="layoutConfig.toolTip && !layoutConfig.balance" [tip]="layoutConfig.toolTip"></app-icon-tooltip></div>
                <div id="balance" *ngIf="layoutConfig.balance">
                    Balance: {{layoutConfig.balance}}
                    <app-icon-tooltip *ngIf="layoutConfig.toolTip" [tip]="layoutConfig.toolTip"></app-icon-tooltip>
                </div>
              </ion-row>
`,
  styleUrls: ['./label-layout.component.scss'],
})
export class LabelLayoutComponent implements OnInit {
  @Input() layoutConfig: { title, balance?, toolTip?};
  constructor() { }

  ngOnInit() { }

}
