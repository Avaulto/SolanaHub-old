import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services';

interface Wallet {
  name:string;
  addr: any;
  balance: number;
  baseOfPortfolio:string;
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
    addr:this.utils.addrShorthand('secret10hq2llxe3lecmaxpqfpnvf942xxdgpkuwnjd0t').addrShort,
    balance: 8,
    baseOfPortfolio: '50%',
    icon:'/assets/images/Secret.png'
  },
  {
    name: 'atom',
    addr:this.utils.addrShorthand('cosmos10hq2llxe3lecmaxpqfpnvf942xxdgpkuvkxyjh').addrShort,
    balance: 5,
    baseOfPortfolio: '30%',
    icon:'/assets/images/atom.webp'
  },
  {
    name: 'juno',
    addr: this.utils.addrShorthand('juno10hq2llxe3lecmaxpqfpnvf942xxdgpku6y9l4t').addrShort,
    balance: 2.5,
    baseOfPortfolio: '20%',
    icon:'/assets/images/juno.webp'
  }
]
  constructor(private utils: UtilsService) { }

  ngOnInit() {}

}
