import { Component, OnInit } from '@angular/core';

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
    //   name: 'The lab',
    //   image: 'assets/images/icons/jupiter-logo.svg',
    //   description: `Jupiter brings together all the liquidity sources across Solana into a single endpoint, providing crucial swap aggregation, pricing data and payment features for all users and developers alike.`,
    //   learnMoreLink: 'https://docs.jup.ag/',
    //   deepLink: 'token-swap'
    // },
  ]
  constructor() { }

  ngOnInit() {
  }

}
