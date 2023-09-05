import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-prize-pool',
  templateUrl: './prize-pool.component.html',
  styleUrls: ['./prize-pool.component.scss'],
})
export class PrizePoolComponent  implements OnInit {
  @Input() prizePool: number = 0
  constructor() { }

  ngOnInit() {}

}
