import { Component, OnInit, ViewChild } from '@angular/core';
import { faDiscord, faTwitter, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

import { IonPopover, MenuController } from '@ionic/angular';
import { pages } from '../../helpers/menu';


@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.page.html',
  styleUrls: ['./side-menu.page.scss'],
})
export class SideMenuPage implements OnInit {
  @ViewChild('popover') popover:IonPopover;
  public discordIcon = faDiscord;
  public twitterIcon = faTwitter; 
  public githubIcon = faGithub;
  public dropDownIcon = faAngleDown;
  constructor(private _menu: MenuController) {
    this.openFirst()
  }
  openFirst() {
    this._menu.enable(true, 'first');
    this._menu.open('first');
  }

  openEnd() {
    this._menu.open('end');
  }

  pages = pages

  ngOnInit() {
  }
  isTncOpen = false;

  presentTncPopover(e?: Event) {
    this.popover.event = null;
    this.popover.cssClass = 'tncPopup'
    this.isTncOpen = true;
  }

  openTNC(){

  }
}
