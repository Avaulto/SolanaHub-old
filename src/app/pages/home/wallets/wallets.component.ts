import { Component, OnInit } from '@angular/core';

interface Wallet {
  name:string;
  addr: string;
  balance: number;
  icon: string;
}
@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.scss'],
})
export class WalletsComponent implements OnInit {

  public wallets: Wallet[] = [{
    name: 'secret',
    addr:'secret10hq2llxe3lecmaxpqfpnvf942xxdgpkuwnjd0t',
    balance: 10,
    icon:''
  },
  {
    name: 'atom',
    addr:'cosmos10hq2llxe3lecmaxpqfpnvf942xxdgpkuvkxyjh',
    balance: 10,
    icon:''
  },
  {
    name: 'juno',
    addr:'juno10hq2llxe3lecmaxpqfpnvf942xxdgpku6y9l4t',
    balance: 10,
    icon:''
  }
]
  constructor() { }

  ngOnInit() {}

}
