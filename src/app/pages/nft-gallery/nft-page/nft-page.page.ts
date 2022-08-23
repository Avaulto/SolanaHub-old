import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Nft } from '../../../models';

@Component({
  selector: 'app-nft-page',
  templateUrl: './nft-page.page.html',
  styleUrls: ['./nft-page.page.scss'],
})
export class NftPagePage implements OnInit {
  public NFT: Nft | any;
  constructor(private router:Router) { }

  ngOnInit() {
    this.NFT = this.router.getCurrentNavigation()?.extras?.state
    // console.log(this.router.getCurrentNavigation().extras.state)
  }

}
