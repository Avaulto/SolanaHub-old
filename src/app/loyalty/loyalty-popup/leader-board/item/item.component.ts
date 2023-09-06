import { Component, Input, OnInit } from '@angular/core';
import { WalletExtended } from 'src/app/models';
import { LoyaltyPoint } from 'src/app/models/loyalty.model';
import { UtilsService } from 'src/app/services';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent  implements OnInit {
  @Input() index;
  @Input() loyaltyScore: LoyaltyPoint;
  @Input() prizePool: number = 0;
  @Input() wallet: WalletExtended;
  constructor(private _utilsService:UtilsService) { }

  ngOnInit() {
  }
  public shortenAddr(addr: string){
    return this._utilsService.addrUtil(addr).addrShort
  }

}
