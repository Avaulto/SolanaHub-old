import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements OnInit {
  @Input() menu: string[] = [];
  @Output() onSelectTab = new EventEmitter();
  public currentTab: string;
  constructor() { }

  ngOnInit() {
    this.currentTab = this.menu[0];
  }
  public setTab(name: string): void{
    this.currentTab = name;
    this.onSelectTab.emit(name);
  }
}
