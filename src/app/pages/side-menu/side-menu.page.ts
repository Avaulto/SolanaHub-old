import { Component, OnInit } from '@angular/core';
import { faBox, faHome, faImage, faScrewdriverWrench, faWallet } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.page.html',
  styleUrls: ['./side-menu.page.scss'],
})
export class SideMenuPage implements OnInit {
  public profileIcon = faScrewdriverWrench;
  constructor() { }
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
          title: "wallet address",
          sub:'$653',
          url: "/side-menu/wallet/test3",
          icon:faWallet
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

  ngOnInit() {
  }
  selectCurrency(ev){
    console.log(ev)
  }
}
