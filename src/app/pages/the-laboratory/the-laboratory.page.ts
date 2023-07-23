import { Component, OnInit } from '@angular/core';
import { DefiApp } from 'src/app/models';

@Component({
  selector: 'app-the-laboratory',
  templateUrl: './the-laboratory.page.html',
  styleUrls: ['./the-laboratory.page.scss'],
})
export class TheLaboratoryPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  public defiLab: DefiApp[] = [
    {
      name: 'marinade plus',
      image: 'assets/images/icons/liquid-stake-logo.gif',
      description: `Simple strategy that stake your SOL with mariande platform, get mSOL in return, and deposit them on solend for extra MNDE reward`,
      learnMoreLink: 'https://solana.org/stake-pools',
      deepLink: 'marinade-plus',
      status:'active'
    }
  ]
}
