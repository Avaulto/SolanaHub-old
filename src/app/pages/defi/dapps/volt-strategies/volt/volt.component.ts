import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { AllMainnetVolt } from 'src/app/models';
import { DataAggregatorService, UtilsService } from 'src/app/services';
import { VoltPopupComponent } from './volt-popup/volt-popup.component';

@Component({
  selector: 'app-volt',
  templateUrl: './volt.component.html',
  styleUrls: ['./volt.component.scss'],
  animations: [
    trigger('flipState', [
      state('active', style({
        transform: 'rotateY(179deg)'
      })),
      state('inactive', style({
        transform: 'rotateY(0)'
      })),
      transition('active => inactive', animate('500ms ease-out')),
      transition('inactive => active', animate('500ms ease-in'))
    ])
  ]
})
export class VoltComponent implements OnInit {
  flip: string = 'inactive';

  toggleFlip() {
    this.flip = (this.flip == 'inactive') ? 'active' : 'inactive';
  }
  
  @Input() volt: AllMainnetVolt;
  public voltTemp: AllMainnetVolt;
  @Input() highVolt: AllMainnetVolt | null;
  @Input() isConnected: boolean = false;

  public voltToolTip = '';
  public progress: number = 0;
  public totalDepositUsd;
  constructor(
    private _dataAggregator: DataAggregatorService,
    private _utilsService: UtilsService,
    public popoverController: PopoverController,
  ) { }

  async ngOnInit() {
    this.volt.depositTokenImage = await this.getDepositTokenIcon();
    this.volt.underlineTokenImage = await this.getUnderlineTokenIcon();
    this.setVoltToolTip(this.volt.voltType);
    this.progress = this.volt.tvlUsd / this.volt.capacityUsd;
    this.totalDepositUsd = this.volt.tvlUsd.toLocaleString();


    // store initial volt value
    this.voltTemp = this.volt;
  }

  async getDepositTokenIcon(): Promise<string> {
    return await (await firstValueFrom(this._dataAggregator.getCoinData(this.volt.depositTokenCoingeckoId))).image.large;
  }
  async getUnderlineTokenIcon(): Promise<string> {
    if(this.volt.depositTokenCoingeckoId != this.volt.underlyingTokenCoingeckoId){
      return await (await firstValueFrom(this._dataAggregator.getCoinData(this.volt.underlyingTokenCoingeckoId))).image.large;
    }
    return this.volt.depositTokenImage;
  }
  private setVoltToolTip(voltType: number): void {
    let toolTip = '';
    switch (voltType) {
      case 1:
        toolTip = 'Best in bearish to mild bull markets'
        break;
      case 2:
        toolTip = 'Best in bull to moderately bearish markets (rising prices lowering chance of options being exercised)'
        break;
      case 3:
        toolTip = 'Best in range-bound "crab" markets. Based on current funding rates, this strategy would be unprofitable if BTC moves more than +/-11.7% every Epoch (the Profit Range).'
        break;
      case 4:
        toolTip = 'Best in negative funding rate environments (perpetuals trade below spot)'
        break;
      case 5:
        toolTip = 'Best in volatile markets with rising interest rates.'
        break;
    }
    this.voltToolTip = toolTip;
  }
  public async deposit(): Promise<void>{
    const popover = await this.popoverController.create({
      component: VoltPopupComponent,
      // event: e,
      componentProps: {volt: this.volt},
      alignment: 'start',
      side: 'top',
      cssClass: 'wallet-connect-dropdown'
    });
    await popover.present();
  }
  public switchToHighVolt(event):void{
     if(event.detail.checked){
       this.volt = this.highVolt;
     }else{
      this.volt = this.voltTemp;
     }
  }
}
