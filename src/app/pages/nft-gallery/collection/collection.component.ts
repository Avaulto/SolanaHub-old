import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { NftGalleryPage } from '../nft-gallery.page';


@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss'],
})
export class CollectionComponent implements OnChanges {
  @Input() collection;
  hideSkelaton: boolean = false;
  priceSum=this._nftGalleryPage.priceSum
  
  constructor(
    private navCtrl: NavController,
    private _nftGalleryPage: NftGalleryPage
    ) { }


  ngOnChanges(){
    console.log(this.collection)
  }

  goToNFTpage(nft){
    this.navCtrl.navigateForward('side-menu/nft-gallery/'+nft.mintAddr,{state: nft})
  }
}
