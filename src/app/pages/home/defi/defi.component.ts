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
      desc: 'The cheapest & fastest way to swap tokens',
      img: 'https://jup.ag/svg/jupiter-logo.svg',
      link: '/defi/token-swap'
    },
    {
      name: 'Marinade',
      desc: 'Stake Solana without locking in your funds',
      img: '/assets/images/icons/marinade-logo-small.svg',
      link: '/defi/liquid-stake'
    },
    {
      name: 'Orca',
      desc: 'Join Defi pools over solana with your favorite coins',
      img: '/assets/images/icons/orca-logo.png',
      link: '#'
    },
    {
      name: 'Solend',
      desc: 'Earn interest and borrow assets on the best lending protocol over solana.',
      img: '/assets/images/icons/solend-logo.webp',
      link: '#'
    },
    
  ]
}
