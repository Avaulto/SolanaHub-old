import { Component, OnInit } from '@angular/core';
import { LoyaltyService } from '../loyalty.service';
import { Observable } from 'rxjs';
import { PrizePool } from 'src/app/models/loyalty.model';

@Component({
  selector: 'app-loyalty-popup',
  templateUrl: './loyalty-popup.component.html',
  styleUrls: ['./loyalty-popup.component.scss'],
})
export class LoyaltyPopupComponent  implements OnInit {
  public prizePool$:Observable<PrizePool> = this._loyaltyService.getPrizePool()
  constructor(
    private _loyaltyService: LoyaltyService
   ) { }

  ngOnInit() {}
  
}
