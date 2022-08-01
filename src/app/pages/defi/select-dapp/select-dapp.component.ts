import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-select-dapp',
  templateUrl: './select-dapp.component.html',
  styleUrls: ['./select-dapp.component.scss'],
})
export class SelectDappComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log('select dapp loaded')
  }

}
