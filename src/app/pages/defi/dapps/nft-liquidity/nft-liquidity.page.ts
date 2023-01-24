import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-nft-liquidity',
  templateUrl: './nft-liquidity.page.html',
  styleUrls: ['./nft-liquidity.page.scss'],
})
export class NftLiquidityPage implements OnInit {
  public menu: string[] = ['dashboard', 'borrow', 'lend'];
  public currentTab: string = this.menu[0];
  constructor() { }

  ngOnInit() {

  }

}
