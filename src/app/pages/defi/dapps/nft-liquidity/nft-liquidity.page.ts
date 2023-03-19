import { Component, OnInit } from '@angular/core';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Subscription, switchMap, tap } from 'rxjs';
import { SolanaUtilsService, UtilsService } from 'src/app/services';
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
  constructor(private _walletStore:WalletStore,private _solanaUtilsService: SolanaUtilsService, private _utilsService:UtilsService) { }
  public solBalance: number = 0;
  public wallet$ = this._walletStore.anchorWallet$.pipe(
    this._utilsService.isNotUndefined,
    this._utilsService.isNotNull,
    tap(async wallet =>{
      this.solBalance = ((await this._solanaUtilsService.connection.getBalance(wallet.publicKey)) / LAMPORTS_PER_SOL);
      return wallet
    })
    )

  ionViewWillEnter(){

  }
  searchItem(term: any) {
    this.searchTerm = term.value;
  }
  tabChange(ev){
    this.currentTab = ev
    this.searchTerm = ''
  }
  async ngOnInit() {

  }

}
