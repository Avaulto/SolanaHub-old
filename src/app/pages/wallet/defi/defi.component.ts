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
      desc: 'Swap Infrastructure for Solana',
      img: 'https://jup.ag/svg/jupiter-logo.svg',
      link: '#'
    },
    {
      name: 'magic eden',
      desc: 'Home to the next generation of digital creators',
      img: 'https://play-lh.googleusercontent.com/Z1Bws4X7ZpDWT5qaEO9D2LO3Ts9vvyUQNJFtnHkFrmNBL6JaxjDvHjJtlPGSyELdlAs',
      link: '#'
    }
  ]
}
