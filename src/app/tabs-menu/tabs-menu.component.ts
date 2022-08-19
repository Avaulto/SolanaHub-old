import { Component, OnInit } from '@angular/core';
import { pages } from '../shared/helpers/menu';

@Component({
  selector: 'app-tabs-menu',
  templateUrl: './tabs-menu.component.html',
  styleUrls: ['./tabs-menu.component.scss'],
})
export class TabsMenuComponent implements OnInit {
  pages = pages;
  constructor() { }

  ngOnInit() {}

}
