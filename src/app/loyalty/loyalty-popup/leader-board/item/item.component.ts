import { Component, Input, OnInit } from '@angular/core';
import { WalletExtended } from 'src/app/models';
import { AvalutoLoyaltyPoint } from 'src/app/models/avaulto-loyalty.model';
import { UtilsService } from 'src/app/services';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent  implements OnInit {
  @Input() index;
  @Input() loyaltyScore: AvalutoLoyaltyPoint;
  @Input() prizePool: number = 1000;
  @Input() wallet: WalletExtended;
  constructor(private _utilsService:UtilsService) { }

  ngOnInit() {
    console.log(this.loyaltyScore)
  }
  public shortenAddr(addr: string){
    return this._utilsService.addrUtil(addr).addrShort
  }

}
