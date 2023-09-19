import { Component, Input, OnInit } from '@angular/core';
import { PrizePool } from 'src/app/models/loyalty.model';

@Component({
  selector: 'app-prize-pool',
  templateUrl: './prize-pool.component.html',
  styleUrls: ['./prize-pool.component.scss'],
})
export class PrizePoolComponent  implements OnInit {
  @Input() prizePool: PrizePool;
  constructor() { }

  ngOnInit() {}

}
