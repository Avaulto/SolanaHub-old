import { Component, OnInit } from '@angular/core';
import { faKickstarterK } from '@fortawesome/free-brands-svg-icons';
import { faArrowRightArrowLeft, faBox, faBoxOpen, faDroplet, faHandHoldingDroplet, faHome, faImage, faPalette, faPlus, faScrewdriverWrench, faSeedling, faShieldHeart, faSwimmingPool, faWallet } from '@fortawesome/free-solid-svg-icons';
import { MenuController } from '@ionic/angular';


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
  pages: any = [
    {
      title: "overview",
      url: "home",
      icon: faHome,
    },
    {
      title: "wallet",
      url: "wallet",
      icon: faWallet
    },
    {
      title: "NFT",
      url: "nft-gallery",
      icon: faPalette
    },
    {
      title: "swap",
      url: "token-swap",
      icon: faArrowRightArrowLeft,
    },
    {
      title: "liquid staking",
      url: "liquid-stake",
      icon: faHandHoldingDroplet,
    },
    {
      title: "pools",
      url: "/defi/pools",
      icon: faSwimmingPool,
    },
    {
      title: "support-us",
      url: "support-us",
      icon: faShieldHeart,
    },
    // {
    //   title: "Defi",
    //   icon: faBox,
    //   children: [
    //     {
    //       title: "swap",
    //       url: "/defi/swap",
    //       icon: faArrowRightArrowLeft,
    //     },
    //     {
    //       title: "liquid staking",
    //       url: "/defi/liquid-staking",
    //       icon: faHandHoldingDroplet,
    //     },
    //     {
    //       title: "pools",
    //       url: "/defi/pools",
    //       icon: faSwimmingPool,
    //     },
    //   ]
    // },

  ];
  addNewWallet() {
  }
  ngOnInit() {
  }
  selectCurrency(ev) {
    // console.log(ev)
  }

}
