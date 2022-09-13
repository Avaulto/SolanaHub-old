import { Component, OnInit, ViewChild } from '@angular/core';
import { faKickstarterK } from '@fortawesome/free-brands-svg-icons';
import { faArrowRightArrowLeft, faBox, faBoxOpen, faCoins, faDroplet, faHandHoldingDroplet, faHome, faImage, faPalette, faPlus, faScrewdriverWrench, faSeedling, faShieldHeart, faSwimmingPool, faWallet } from '@fortawesome/free-solid-svg-icons';
import { IonPopover, MenuController } from '@ionic/angular';
import { pages } from '../../helpers/menu';


@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.page.html',
  styleUrls: ['./side-menu.page.scss'],
})
export class SideMenuPage implements OnInit {
  @ViewChild('popover') popover:IonPopover;
  public profileIcon = faScrewdriverWrench;
  public boxOpen = faBoxOpen
  constructor(private menu: MenuController,

    ) {
    this.openFirst()
  }
  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  openEnd() {
    this.menu.open('end');
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
