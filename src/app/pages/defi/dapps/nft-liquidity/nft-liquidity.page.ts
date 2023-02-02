import { Component, OnInit } from '@angular/core';
import { SolanaUtilsService } from 'src/app/services';
@Component({
  selector: 'app-nft-liquidity',
  templateUrl: './nft-liquidity.page.html',
  styleUrls: ['./nft-liquidity.page.scss'],
})
export class NftLiquidityPage implements OnInit {
  public menu: string[] = ['dashboard', 'borrow', 'lend'];
  public currentTab: string = this.menu[0];
  constructor(private _solanaUtilsService:SolanaUtilsService) { }

  async ngOnInit() {
    // const poolDataByMint = await pools.fetchPoolDataByMint({
    //     connection: this._solanaUtilsService.connection,
    //     tokensMap: new Map<string, TokenInfo>(),
    // });
    // console.log(poolDataByMint)
  }

}
