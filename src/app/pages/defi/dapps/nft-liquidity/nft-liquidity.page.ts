import { Component, OnInit } from '@angular/core';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { SolanaUtilsService } from 'src/app/services';
@Component({
  selector: 'app-nft-liquidity',
  templateUrl: './nft-liquidity.page.html',
  styleUrls: ['./nft-liquidity.page.scss'],
})
export class NftLiquidityPage implements OnInit {
  public menu: string[] = ['dashboard', 'borrow', 'lend'];
  public currentTab: string = this.menu[0];
  readonly isReady$ = this._walletStore.connected$
  public searchTerm: string;
  constructor(private _walletStore:WalletStore) { }
  searchItem(term: any) {
    this.searchTerm = term.value;
  }
  tabChange(ev){
    this.currentTab = ev
    this.searchTerm = ''
  }
  async ngOnInit() {
    // const poolDataByMint = await pools.fetchPoolDataByMint({
    //     connection: this._solanaUtilsService.connection,
    //     tokensMap: new Map<string, TokenInfo>(),
    // });
    // console.log(poolDataByMint)
  }

}
