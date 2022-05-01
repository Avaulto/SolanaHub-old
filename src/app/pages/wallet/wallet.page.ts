import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {
  public wallet ={
    name: 'secret',
    addr:'secret10hq2llxe3lecmaxpqfpnvf942xxdgpkuwnjd0t',
    shortAddr:this.utils.addrShorthand('secret10hq2llxe3lecmaxpqfpnvf942xxdgpkuwnjd0t').addrShort,
    balance: 8.00,
    baseOfPortfolio: '50%',
    icon:'/assets/images/Secret.png'
  }
  constructor(private utils: UtilsService) { }

  ngOnInit() {
  }

}
