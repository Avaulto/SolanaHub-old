import { Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import { UtilsService } from 'src/app/services';

@Component({
  selector: 'app-defi',
  templateUrl: './defi.component.html',
  styleUrls: ['./defi.component.scss'],
})
export class DefiComponent implements OnChanges {
  @Input('portfolioDeFi') portfolioDeFi = null;
  constructor(private _utilsService: UtilsService) { }

ngOnChanges(changes: SimpleChanges): void {
  console.log(this.portfolioDeFi)
}

  formatNumber = n => {
    return this._utilsService.formatBigNumbers(n);
  };
}
