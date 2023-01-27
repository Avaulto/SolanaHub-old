import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-defi',
  templateUrl: './defi.component.html',
  styleUrls: ['./defi.component.scss'],
})
export class DefiComponent implements OnInit {

  constructor() { }

  ngOnInit() { }
  public defiApps = [
    {
      name: 'Jupiter',
      description: 'The cheapest & fastest way to swap tokens',
      image: 'https://jup.ag/svg/jupiter-logo.svg',
      deepLink: '/defi/token-swap'
    },
    {
      name: 'Liquid staking',
      description: 'Stake Solana without locking in your funds',
      image: '/assets/images/icons/liquid-stake-logo.gif',
      deepLink: '/defi/liquid-stake'
    },
    {
      name: 'Orca',
      description: 'Provide liquidity to a liquidity pools',
      image: '/assets/images/icons/orca-logo.png',
      deepLink: '#'
    },
    {
      name: 'Frakt',
      description: 'FRAKT Loans is the first decentralized peer-to-pool based NFT liquidity protocol on Solana',
      image: 'assets/images/icons/frakt-logo.jpeg',
      deepLink: '#'
    }
  ]
}
