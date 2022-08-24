import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Nft } from '../../../../models';

@Component({
  selector: 'app-nft-item',
  templateUrl: './nft-item.component.html',
  styleUrls: ['./nft-item.component.scss'],
})
export class NftItemComponent implements OnInit {
  @Input() nft:Nft
  constructor(private navCtrl: NavController) { }
  hideSkelaton: boolean = false;
  ngOnInit() {
    console.log(this.nft)
  }
  goToNFTpage(nft){
    this.navCtrl.navigateForward('side-menu/nft-gallery/'+nft.mintAddr,{state: nft})
  }
}
