import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-label-layout',
  template: `  <ion-row style="margin-bottom:8px" class="heading-6 ion-align-items-center ion-justify-content-between">
                <div id="label"><span>{{layoutConfig.title}} </span>
              </div>
                <div id="balance" *ngIf="layoutConfig.balance">
                    <span>
                      Balance: {{layoutConfig.balance}}
                    </span>
                    <ng-content></ng-content>
                  </div>
              </ion-row>
`,
  styleUrls: ['./label-layout.component.scss'],
})
export class LabelLayoutComponent implements OnInit {
  @Input() layoutConfig: { title, balance?};
  constructor() { }

  ngOnInit() { }

}
