import { Component, OnInit } from '@angular/core';
import { LoyaltyService } from '../loyalty.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-loyalty-popup',
  templateUrl: './loyalty-popup.component.html',
  styleUrls: ['./loyalty-popup.component.scss'],
})
export class LoyaltyPopupComponent  implements OnInit {
  public prizePool$:Observable<number> = this._loyaltyService.getPrizePool()
  constructor(
    private _loyaltyService: LoyaltyService
   ) { }

  ngOnInit() {}
  
}
