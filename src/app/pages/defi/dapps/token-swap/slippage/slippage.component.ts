import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
@Component({
  selector: 'app-slippage',
  templateUrl: './slippage.component.html',
  styleUrls: ['./slippage.component.scss'],
  animations: [
    trigger('flyInOut', [
      state('in', style({ transform: 'translateX(55%)' })),
      transition('void => *', [
        style({ transform: 'translateX(100%)' }),
        animate(300)
      ]),
      transition('* => void', [
        animate(300, style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class SlippageComponent implements OnInit {
  public showSlippageOptions: boolean = false;
  @Input() form: FormGroup = {} as FormGroup;
  public currentSlippage: number = 50 // 0.5%
  constructor() { }

  ngOnInit() {}
  public slippageChange(event){
    this.showSlippageOptions = false;
    const slippage = event.detail.value;
    this.currentSlippage = slippage
    this.form.controls.slippage.setValue(slippage)
  }
  get isValid() { return this.form.controls.splippage.valid}
  get isDirty() { return this.form.controls.splippage.dirty}
}
