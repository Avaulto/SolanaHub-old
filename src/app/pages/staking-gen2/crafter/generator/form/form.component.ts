import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SolanaUtilsService } from 'src/app/services';
import { StakingGen2Service } from '../../../staking-gen2.service';
import { WalletExtended } from 'src/app/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent  implements OnInit {
  public menu: string[] = ['new stake', 'active stake'];
  public currentTab: string = this.menu[0];
  public craftForm: FormGroup;
  public formSubmitted: boolean = false;
  public wallet$: Observable<WalletExtended> = this._solanaUtilsService.walletExtended$;
  constructor(
    private _solanaUtilsService:SolanaUtilsService, 
    private _stakingGen2Service: StakingGen2Service,
    private _fb: FormBuilder,
    ) { }

  ngOnInit() {
    this.craftForm = this._fb.group({
      stakeAmount: ['', [Validators.required]]
    })
  }
  setMaxAmountSOL(){}
  stakeGen2(){}
}
