import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { DefiTourComponent } from './defi-tour/defi-tour.component';

interface DefiApps {
  name: string;
  image: string;
  description: string;
  learnMoreLink: string;
  deepLink: string;
}
@Component({
  selector: 'app-defi',
  templateUrl: './defi.page.html',
  styleUrls: ['./defi.page.scss'],
})
export class DefiPage implements OnInit {
  public defiApps: DefiApps[] = [
    {
      name: 'marinade finance',
      image: 'assets/images/icons/marinade-logo-small.svg',
      description: `Marinade.Finance is a non-custodial liquid staking protocol built on Solana. You can stake your SOL tokens with Marinade using automated staking strategies and receive "marinated SOL" tokens (mSOL) that you can use in decentralized finance (DeFi). `,
      learnMoreLink: 'https://docs.marinade.finance/',
      deepLink: 'liquid-stake'
    },
    {
      name: 'jupiter',
      image: 'assets/images/icons/jupiter-logo.svg',
      description: `Jupiter brings together all the liquidity sources across Solana into a single endpoint, providing crucial swap aggregation, pricing data and payment features for all users and developers alike.`,
      learnMoreLink: 'https://docs.jup.ag/',
      deepLink: 'token-swap'
    },
    // {
    //   name: 'orca',
    //   image: 'assets/images/icons/orca-logo.svg',
    //   description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.`,
    //   learnMoreLink: 'https://docs.orca.so/orca-for-liquidity-providers/how-to-provide-liquidity-on-orca',
    //   deepLink: 'pools'
    // },
    {
      name: 'friktion',
      image: 'assets/images/icons/friktionBolt.png',
      description: `Passive, quantitative strategies generating returns based on market opportunities. Volts allow anyone to access strategies that are built with risk & returns, principal protection, and volatility in mind. `,
      learnMoreLink: 'https://docs.friktion.fi/',
      deepLink: 'volt-strategies'
    },
    // {
    //   name: 'frakt',
    //   image: 'assets/images/icons/frakt-logo.jpeg',
    //   description: `FRAKT Loans is the first decentralized peer-to-pool based NFT liquidity protocol on Solana. Depositors provide SOL liquidity to the lending pool to earn interest, while borrowers are able to borrow SOL through the lending pool using NFTs as collateral instantly`,
    //   learnMoreLink: 'https://docs.frakt.xyz/frakt',
    //   deepLink: 'nft-liquidity'
    // },
  ]
  
  constructor(private _popoverController: PopoverController) { }

  ngOnInit() {
  }
  async showDefiTourSlide(e: Event) {
    const popover = await this._popoverController.create({
      component: DefiTourComponent,
      // event: e,
      alignment: 'start',
      cssClass: 'defi-tour-popup',
    });
    await popover.present();
  }
}
