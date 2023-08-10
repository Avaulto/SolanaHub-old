import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MarinadePlusService } from '../../strategies-builder/marinade-plus.service';
import { UtilsService } from 'src/app/services';
import { LabStrategyConfiguration, WalletExtended } from 'src/app/models';
import { SolblazeFarmerService } from '../../strategies-builder/solblaze-farmer.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.scss'],
})
export class DepositComponent implements OnInit {
  @Input() strategyConfiguration: LabStrategyConfiguration;
  @Input() strategyAPY: number | string = 0;
  @Input() walletExtended$: WalletExtended;
  public loader: boolean = false;
  public depositForm: FormGroup;
  public formSubmitted: boolean = false;
  constructor(
    private _fb: FormBuilder,
    private _utilsService: UtilsService,
    private _marinadePlusService: MarinadePlusService,
    private _solblazeFarmerService:SolblazeFarmerService
  ) { }

  ngOnInit() { 
    this.depositForm = this._fb.group({
      amount: ['', [Validators.required]]
    })
  }
  setMaxAmountSOL() {
    this.depositForm.controls.amount.setValue(this._utilsService.shortenNum(this.walletExtended$.balance - 0.001));
  }
  async submit() {
    let { amount } = this.depositForm.value;
    // const wallet = this._solanaUtilsService.getCurrentWallet();
    if (this.strategyConfiguration.strategyName === 'marinade-plus') {
      this._marinadePlusService.deposit(amount)
    }
    if (this.strategyConfiguration.strategyName === 'solblaze-farmer') {
      this.loader = true
      await this._solblazeFarmerService.deposit(amount);
      this._solblazeFarmerService.fetchUserHoldings$.next(true)
      this.loader = false
    }
  }


}
