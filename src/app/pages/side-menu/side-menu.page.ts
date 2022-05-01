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

  currencies: string[] = ['BTC','USD'];
  pages: any = [
    {
      title: "overview",
      url: "/side-menu/home",
      icon:faHome,
      children: [
        {
          title: "wallet address",
          sub:'$123',
          url: "/side-menu/wallet/test",
          icon:faWallet
        },
        {
          title: "wallet address",
          sub:'$444',
          url: "/side-menu/wallet/test2",
          icon:faWallet
        },
        {
          title: "add wallet",
          // sub:'$653',
          url: "/side-menu/new-wallet",
          icon:faPlus,
          action: this.addNewWallet()
        },
      ],
    },
    {
      title: "nft",
      url: "/side-menu/nft-gallery",
      icon:faImage
    },
    {
      title: "Defi",
      url: "/side-menu/defi",
      icon:faBox
    }
  ];
  addNewWallet(){
    console.log('add new wallet')
  }
  ngOnInit() {
  }
  selectCurrency(ev){
    console.log(ev)
  }
}
