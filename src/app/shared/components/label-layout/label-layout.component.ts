import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-label-layout',
  template: `  <ion-row style="margin-bottom:8px" class="heading-6 ion-justify-content-between">
                <div id="">{{layoutConfig.title}}</div>
                <div id="balance" *ngIf="layoutConfig.balance">
                    Balance: {{layoutConfig.balance}}
                    <ion-icon
                        *ngIf="layoutConfig.toolTip"
                        [tooltip]="layoutConfig.toolTip"
                        placement="top" name="alert-circle-outline"></ion-icon>
                </div>
              </ion-row>
`,
  styleUrls: ['./label-layout.component.scss'],
})
export class LabelLayoutComponent implements OnInit {
  @Input() layoutConfig: { title, balance?, toolTip? };
  constructor() { }

  ngOnInit() { }

}
