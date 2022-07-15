import { Component, OnInit } from '@angular/core';
import { faBox, faHome, faImage, faPlus, faScrewdriverWrench, faWallet } from '@fortawesome/free-solid-svg-icons';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.page.html',
  styleUrls: ['./side-menu.page.scss'],
})
export class SideMenuPage implements OnInit {
  public profileIcon = faScrewdriverWrench;
  constructor(private menu: MenuController) {
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
  pages: any = [
    {
      title: "overview",
      url: "/side-menu/home",
      icon: faHome,
    },
    {
      title: "wallet",
      url: "/side-menu/wallet",
      icon: faWallet
    },
    {
      title: "NFT",
      url: "/side-menu/nft-gallery",
      icon: faWallet
    },
    {
      title: "Defi",
      url: "/side-menu/defi",
      icon: faBox
    }
  ];
  addNewWallet() {
  }
  ngOnInit() {
  }
  selectCurrency(ev) {
    console.log(ev)
  }
}
