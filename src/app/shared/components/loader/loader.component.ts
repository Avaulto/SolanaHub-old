
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader',
  template: `<div class="lds-ring"><div></div><div></div><div></div><div></div></div>`,
  styleUrls: ['./loader.component.scss'],
  standalone: true,
})
export class LoaderComponent implements OnInit {

  constructor() {}

  ngOnInit() {
  }
 
}
