import { Component, Input, OnInit } from '@angular/core';
import { LoyaltyService } from '../loyalty.service';
import { Observable, shareReplay } from 'rxjs';
import { LoyaltyLeaderBoard, LoyaltyPoint, PrizePool } from 'src/app/models/loyalty.model';

@Component({
  selector: 'app-loyalty-popup',
  templateUrl: './loyalty-popup.component.html',
  styleUrls: ['./loyalty-popup.component.scss'],
})
export class LoyaltyPopupComponent  implements OnInit {
  @Input() prizePool: PrizePool //= this._loyaltyService.getPrizePool().pipe(shareReplay())
  @Input() loyaltyLeaderBoard: LoyaltyLeaderBoard 
  constructor(
    private _loyaltyService: LoyaltyService
   ) { }

  ngOnInit() {

  }
  
}
