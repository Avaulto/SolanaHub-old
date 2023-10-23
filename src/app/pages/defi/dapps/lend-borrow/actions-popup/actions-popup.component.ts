import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SolendObligation, SolendReserve } from '@solendprotocol/solend-sdk';
import { UtilsService } from 'src/app/services';

@Component({
  selector: 'app-actions-popup',
  templateUrl: './actions-popup.component.html',
  styleUrls: ['./actions-popup.component.scss'],
})
export class ActionsPopupComponent  implements OnInit {
  @Input() tabIndex: number = 0
  @Input() pool: SolendReserve;
  public menu: string[] = ['supply', 'borrow', 'withdraw', 'repay'];
  public currentTab: string = this.menu[this.tabIndex]
  public solendActionsForm: FormGroup;
  public formSubmitted: boolean = false;
  constructor(
    private _fb: FormBuilder,
    private _utilsService: UtilsService
    ) { }

  ngOnInit() {
    console.log(this.pool)   
     this.solendActionsForm = this._fb.group({
      // mintAddress: [this.coin.address, Validators.required],
      amount: ['', [Validators.required]],
    })
  }
  setMaxAmount() {
    // const fixedAmount = this._utilsService.shortenNum(this.pool.)
    // this.depositAndWithdraw.controls.amount.setValue(fixedAmount);
  }
  formatNumber = n => {
    return this._utilsService.formatBigNumbers(n);
  };

  async submit() {
    this.formSubmitted = true;
    // do solend action
    this.formSubmitted = true;
  }

}
