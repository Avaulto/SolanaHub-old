import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SolblazeFarmerService } from '../../strategies-builder/solblaze-farmer.service';

@Component({
  selector: 'app-tx-process-status',
  templateUrl: './tx-process-status.component.html',
  styleUrls: ['./tx-process-status.component.scss'],
})
export class TxProcessStatusComponent  implements OnInit,OnDestroy {

  private txStatus$;
 public txStatus:{totalTx:number, finishTx: number, start: boolean} = null
 constructor(private _solblazeFarmerService:SolblazeFarmerService) {}

  ngOnInit() {
    this.txStatus$ = this._solblazeFarmerService.txStatus$
    .subscribe(val =>{
      this.txStatus = val
    })
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.txStatus$.unsubscribe()
  }

}
