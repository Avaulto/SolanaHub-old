import { Component, OnInit } from '@angular/core';
import { LoyaltyService } from 'src/app/loyalty/loyalty.service';
import { UtilsService } from 'src/app/services';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss'],
})
export class ScoreComponent  implements OnInit {

  public loyaltyScore$ = this._loyaltyService.getLoyaltyScore()
  constructor(
    private _loyaltyService: LoyaltyService
     ) { }
  ngOnInit() {}

}
