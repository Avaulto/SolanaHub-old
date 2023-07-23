import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PopoverController } from '@ionic/angular';
import { DefiTourComponent } from './defi-tour/defi-tour.component';
import { DefiApp } from 'src/app/models';

@Component({
  selector: 'app-defi',
  templateUrl: './defi.page.html',
  styleUrls: ['./defi.page.scss'],
})
export class DefiPage   {
  public defiApps: DefiApp[] = [
    {
      name: 'Liquid staking',
      image: 'assets/images/icons/liquid-stake-logo.gif',
      description: `Liquid staking is a non-custodial protocol built on Solana. You can stake your SOL tokens with Pool provider using automated staking strategies and receive equivilant tokens (xSOL) that you can use in decentralized finance (DeFi). `,
      learnMoreLink: 'https://solana.org/stake-pools',
      deepLink: 'liquid-stake',
      status:'active'
    },
    {
      name: 'jupiter',
      image: 'assets/images/icons/jupiter-logo.svg',
      description: `Jupiter brings together all the liquidity sources across Solana into a single endpoint, providing crucial swap aggregation, pricing data and payment features for all users and developers alike.`,
      learnMoreLink: 'https://docs.jup.ag/',
      deepLink: 'token-swap',
      status:'active'
    },
    {
      name: 'frakt',
      image: 'assets/images/icons/frakt-logo.jpeg',
      description: `FRAKT Loans is the first decentralized peer-to-pool based NFT liquidity protocol on Solana. Depositors provide SOL liquidity to the lending pool to earn interest, while borrowers are able to borrow SOL through the lending pool using NFTs as collateral instantly`,
      learnMoreLink: 'https://docs.frakt.xyz/frakt',
      deepLink: 'nft-liquidity',
      status:'active'
    },
    // {
    //   name: 'orca',
    //   image: 'assets/images/icons/orca-logo.svg',
    //   description: `Step into the exciting world of Orca, where you can unleash your earning potential by becoming a liquidity provider! Dive into the deep ocean of liquidity pools and swim with the whales in concentrated liquidity pools, known as Whirlpools.`,
    //   learnMoreLink: 'https://docs.orca.so/',
    //   deepLink: 'pools',
    //   status:'pending'
    // },
    // {
    //   name: 'solend',
    //   image: 'assets/images/icons/solend-logo.png',
    //   description: `Solend is an algorithmic, decentralized protocol for lending and borrowing on Solana.`,
    //   learnMoreLink: 'https://docs.solend.fi/',
    //   deepLink: 'lending-strategies',
    //   status:'pending'
    // },
  ]
  
  constructor(private _popoverController: PopoverController, private _titleService: Title) { }
  ionViewWillEnter(){
    this._titleService.setTitle('CompactDeFi - defi')
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
