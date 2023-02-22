import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { UtilsService } from 'src/app/services';
import { FraktStoreService } from '../../frakt-store.service';
import { FraktNftMetadata } from '../../frakt.model';

@Component({
  selector: 'app-box-content',
  templateUrl: './box-content.component.html',
  styleUrls: ['./box-content.component.scss'],
})
export class BoxContentComponent implements OnInit, OnChanges {
  @Input() collectionName: string;
  @Input() accordionOpen: boolean;
  @Input() activeLoans: number;
  public NftMetadata: FraktNftMetadata[] = null
  public menu: string[] = ['deposit', 'withdrawl'];
  public currentTab: string = this.menu[0]
  constructor(private _fraktStore: FraktStoreService, private _utilsService: UtilsService) { }
  ngOnChanges(changes): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (this.accordionOpen) {
      this.getNftMetadata(this.collectionName)
    }
  }

  ngOnInit() { }
  async getNftMetadata(collectionName: string) {
    const metadata = await this._fraktStore.fetchPoolMetadata(collectionName);
    metadata[0].price = metadata[0].price / LAMPORTS_PER_SOL
    metadata[0].liquidityPool = this._utilsService.addrUtil(metadata[0].liquidityPool).addrShort
    this.NftMetadata = metadata
  }

  deposit(){

  }
}
