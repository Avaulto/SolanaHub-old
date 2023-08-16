import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IonCheckbox } from '@ionic/angular';
import { StakeAccountExtended } from 'src/app/models';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  @Input() account: StakeAccountExtended;
  @Input() mergeCondition: boolean = false;
  @Output() onClickAccount: EventEmitter<any> = new EventEmitter();
  @ViewChild('accCheckbox') accCheckbox: IonCheckbox;
  constructor() { }

  ngOnInit() {}
  appendAccountData(){
    this.onClickAccount.emit({ account:this.account, accCheckbox:this.accCheckbox})
  }
}
