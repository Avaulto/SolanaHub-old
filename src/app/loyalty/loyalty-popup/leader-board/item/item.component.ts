import { Component, Input, OnInit } from '@angular/core';
import { PtsCalcIncludePoolShare } from 'src/app/models/avaulto-loyalty.model';
import { UtilsService } from 'src/app/services';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent  implements OnInit {
  @Input() index;
  @Input() loyaltyScore: PtsCalcIncludePoolShare;
  @Input() prizePool: number = 100;
  constructor(private _utilsService:UtilsService) { }

  ngOnInit() {}
  public shortenAddr(addr: string){
    return this._utilsService.addrUtil(addr).addrShort
  }

}
