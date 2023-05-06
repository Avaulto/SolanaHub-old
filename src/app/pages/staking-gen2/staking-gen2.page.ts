import { Component, OnInit } from '@angular/core';
import { PublicKey } from '@metaplex-foundation/js';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { NftStoreService, SolanaUtilsService, TxInterceptService } from 'src/app/services';

@Component({
  selector: 'app-staking-gen2',
  templateUrl: './staking-gen2.page.html',
  styleUrls: ['./staking-gen2.page.scss'],
})
export class StakingGen2Page implements OnInit {
  public menu: string[] = ['my-guaridan', 'crafter'];
  public currentTab: string = this.menu[0];
  public wallet$ = this._solanaUtilsService.walletExtended$
  constructor(
    private _txInterceptService: TxInterceptService,
    private _nftStoreService: NftStoreService,
    private _solanaUtilsService: SolanaUtilsService
  ) { }

  ngOnInit() {
  }
  nftName: string = '';
  async createBondStakeAccount() {
    const sol = 0.1 * LAMPORTS_PER_SOL;
    try {
      const walletOwner = this._solanaUtilsService.getCurrentWallet().publicKey
      const newNft = await this.createNFTowner();
      // const stakeAccount = await this._txInterceptService.delegate(sol, walletOwner, 'dv3qDFk1DTF36Z62bNvrCXe9sKATA6xvVy6A798xxAS', 0)
      console.log(newNft)
    } catch (error) {
      console.warn(error)
    }
  }
  private async createNFTowner() {
    console.log(this.nftName)
    try {
      const NFT = await this._nftStoreService.createNft(this.nftName)
      return NFT;
    } catch (error) {
      console.error(error)
    }
  }
  tabChange(ev) {
    this.currentTab = ev
  }
}
