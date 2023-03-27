import { Component, EventEmitter, OnInit, Output } from '@angular/core';

// import { utils, loans, pools } from '@frakt-protocol/frakt-sdk';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @Output() onSelectTab = new EventEmitter();
  constructor() { }

  ngOnInit() {}

}
