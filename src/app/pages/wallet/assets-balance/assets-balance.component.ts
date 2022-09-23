import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Asset } from 'src/app/models';

import { UtilsService } from 'src/app/services';

@Component({
  selector: 'app-assets-balance',
  templateUrl: './assets-balance.component.html',
  styleUrls: ['./assets-balance.component.scss'],
})
export class AssetsBalanceComponent implements OnInit {
  @Input() title: string; 
  @Input() assets: Asset[]

  constructor(private _utilsService: UtilsService, private navCtrl: NavController) { }

  ngOnInit() {}
  send(asset: Asset){
    // this.navCtrl.navigateForward('/side-menu/wallet/'+address,{state: asset})
  }
}
