import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SwapDetail } from 'src/app/shared/models/swapDetails.model';


@Component({
  selector: 'app-swap-info',
  templateUrl: './swap-info.component.html',
  styleUrls: ['./swap-info.component.scss'],
})
export class SwapInfoComponent implements OnInit {
  @Input() swapDetail: Observable<SwapDetail>;
  public priceImpactScore;

  constructor() { }

  ngOnInit(): void {

    this.swapDetail.subscribe(swapDetail => {
      console.log(swapDetail)
      if ( swapDetail?.priceImpact  < 0.001) {
        this.priceImpactScore = 'excelent'
      } else if(swapDetail?.priceImpact  < 0.01) {
        this.priceImpactScore = 'Ok'
      }else{
        this.priceImpactScore = 'severe'
      }
    })
  }

}
