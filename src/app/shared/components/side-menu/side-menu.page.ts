import { Component, OnInit } from '@angular/core';
import { faKickstarterK } from '@fortawesome/free-brands-svg-icons';
import { faArrowRightArrowLeft, faBox, faBoxOpen, faCoins, faDroplet, faHandHoldingDroplet, faHome, faImage, faPalette, faPlus, faScrewdriverWrench, faSeedling, faShieldHeart, faSwimmingPool, faWallet } from '@fortawesome/free-solid-svg-icons';
import { MenuController } from '@ionic/angular';
import { pages } from '../../helpers/menu';


@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.page.html',
  styleUrls: ['./side-menu.page.scss'],
})
export class SideMenuPage implements OnInit {

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

  currencies: string[] = ['BTC', 'USD'];
  pages = pages

  addNewWallet() {
  }
  ngOnInit() {
  }
  selectCurrency(ev) {
    // console.log(ev)
  }

}
