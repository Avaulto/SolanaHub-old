import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stake',
  templateUrl: './stake.component.html',
  styleUrls: ['./stake.component.scss'],
})
export class StakeComponent implements OnInit {
  public hasStake: boolean = false;
  constructor() { }

  ngOnInit() {}

}
