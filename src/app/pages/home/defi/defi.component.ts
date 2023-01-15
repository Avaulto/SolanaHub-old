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
      name: 'Liquid staking',
      desc: 'Stake Solana without locking in your funds',
      img: '/assets/images/icons/liquid-stake-logo.gif',
      link: '/defi/liquid-stake'
    },
    {
      name: 'Frition',
      desc: 'Earn interest and borrow assets on the best lending protocol over solana.',
      img: '/assets/images/icons/friktionBoltColored.png',
      link: '/defi/volt-strategies'
    },
    {
      name: 'Orca',
      desc: 'Join Defi pools over solana with your favorite coins',
      img: '/assets/images/icons/orca-logo.png',
      link: '#'
    },
    
  ]
}
