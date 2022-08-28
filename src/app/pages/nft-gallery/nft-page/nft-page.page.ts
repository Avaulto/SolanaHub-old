import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { NftStoreService } from 'src/app/services/nft-store.service';
import { Nft, NFTGroup } from '../../../models';

@Component({
  selector: 'app-nft-page',
  templateUrl: './nft-page.page.html',
  styleUrls: ['./nft-page.page.scss'],
})
export class NftPagePage implements OnInit {
  public NFT: Nft;
  public collectionInfo: NFTGroup
  hideSkelaton: boolean = false;
    constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _nftStoreService: NftStoreService,
  ) {

  }

  ngOnInit() {

    this.activatedRoute.params.subscribe(async (params) => {
      console.log(params)
      const mintAddress = params["mintAddress"];
      const dataSet: Nft | any = this.router.getCurrentNavigation()?.extras?.state;
      if (dataSet) {
        this.NFT = dataSet
      } else {
        this.NFT = await this._getNftData(mintAddress)
      }
      this.collectionInfo = await this.getCollectionData(this.NFT.mintAddress)
    });
  }
  private async _getNftData(mintAddress: string): Promise<Nft> {
    return await this._nftStoreService.getSingleNft(mintAddress);
  }
  private async getCollectionData(mintAddress: string) {
    return await this._nftStoreService.getCollectionData(mintAddress);
  }
  public async listOnME(){
    // return await this._nftStoreService.listNft()
  }
}
