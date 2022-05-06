import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { NFTdata } from 'src/app/models';

@Component({
  selector: 'app-nft-page',
  templateUrl: './nft-page.page.html',
  styleUrls: ['./nft-page.page.scss'],
})
export class NftPagePage implements OnInit {
  // @Input() NFTData
  public NFT: NFTdata | any;
  constructor(private navCtrl:NavController,private router:Router) { }

  ngOnInit() {
    this.NFT = this.router.getCurrentNavigation()?.extras?.state
    // console.log(this.router.getCurrentNavigation().extras.state)
  }
  back(): void {
    this.navCtrl.back({animated:true});
}
}
