import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonTabButton } from '@ionic/angular';
import { pages } from '../shared/helpers/menu';

@Component({
  selector: 'app-tabs-menu',
  templateUrl: './tabs-menu.component.html',
  styleUrls: ['./tabs-menu.component.scss'],
})
export class TabsMenuComponent implements OnInit {
  @ViewChild('tabWarpper') tabWarpper: ElementRef;
  pages = pages;
  constructor() { }

  ngOnInit() { }
  public scroll(eliD: any): void {
    const leftPos = eliD.el.offsetLeft;
    this.tabWarpper.nativeElement.scrollTo({ left: leftPos - 50, behavior: 'smooth' });
  }
}
