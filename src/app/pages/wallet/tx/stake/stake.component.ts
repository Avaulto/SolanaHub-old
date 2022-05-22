import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-stake',
  templateUrl: './stake.component.html',
  styleUrls: ['./stake.component.scss'],
})
export class StakeComponent implements OnInit {

  people = [{key:'name',value:'123'}]
    selectedPersonId = '5a15b13c36e7a7f00cf0d7cb';
  constructor() { }

  ngOnInit() {}
  setMaxAmount(){

  }
}
