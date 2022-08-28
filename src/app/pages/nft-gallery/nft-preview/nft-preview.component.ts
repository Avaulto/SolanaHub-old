import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Nft } from 'src/app/models';


@Component({
  selector: 'app-nft-preview',
  templateUrl: './nft-preview.component.html',
  styleUrls: ['./nft-preview.component.scss'],
})
export class NftPreviewComponent implements OnInit {
  @Input() nft:Nft
  constructor(private navCtrl: NavController) { }
  hideSkelaton: boolean = false;
  ngOnInit() {
    // console.log(this.nft)
  }
  goToNFTpage(nft:Nft){
    console.log(nft)
    this.navCtrl.navigateForward('/nft-gallery/'+nft.mintAddress,{state: nft}).then(r => console.log(r)).catch(e => console.warn(e));
  }
}
