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
      description: 'The cheapest and fastest way to swap tokens',
      image: 'https://jup.ag/svg/jupiter-logo.svg',
      deepLink: '/defi/token-swap'
    },
    {
      name: 'Liquid staking',
      description: 'Stake SOL without locking your funds',
      image: '/assets/images/icons/liquid-stake-logo.gif',
      deepLink: '/defi/liquid-stake'
    },
    {
      name: 'Frakt',
      description: 'Lending and borrowing for NFTs',
      image: 'assets/images/icons/frakt-logo.jpeg',
      deepLink: '#'
    }
  ]
}
