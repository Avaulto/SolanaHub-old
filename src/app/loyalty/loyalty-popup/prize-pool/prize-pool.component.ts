import { Component, Input, OnInit } from '@angular/core';
import { NextAirdrop, PrizePool } from 'src/app/models/loyalty.model';
import { LoyaltyService } from '../../loyalty.service';
import { Observable, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-prize-pool',
  templateUrl: './prize-pool.component.html',
  styleUrls: ['./prize-pool.component.scss'],
})
export class PrizePoolComponent  implements OnInit {
  @Input() prizePool: PrizePool;
  public nextAirdrop:Observable<string> = this._loyaltyService.getNextAirdrop().pipe(map((res:NextAirdrop) =>{
    const dStr = res.days > 1 ? 'days' : 'day';
    return  `ETA in ${res.days} ` + dStr
  }))
  constructor(private _loyaltyService:LoyaltyService) { }

  ngOnInit() {}

} 
