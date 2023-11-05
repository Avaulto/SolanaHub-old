import { Component, Input, OnInit } from '@angular/core';
import { LoyaltyLeaderBoard, NextAirdrop, PrizePool } from 'src/app/models/loyalty.model';
import { LoyaltyService } from '../loyalty.service';
import { Observable, forkJoin, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-prize-pool',
  templateUrl: './prize-pool.component.html',
  styleUrls: ['./prize-pool.component.scss'],
})
export class PrizePoolComponent  implements OnInit {
  @Input() loyaltyLeagueStats: any

 
  constructor(private _loyaltyService:LoyaltyService) { }

  ngOnInit() {}

} 
