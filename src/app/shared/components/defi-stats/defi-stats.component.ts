import { Component, Input, OnInit } from '@angular/core';
import { DefiStat } from 'src/app/models';

@Component({
  selector: 'app-defi-stats',
  templateUrl: './defi-stats.component.html',
  styleUrls: ['./defi-stats.component.scss'],
})
export class DefiStatsComponent  implements OnInit {
  @Input() stats: DefiStat[];
  constructor() { }

  ngOnInit() {}

}
