import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Output() onDepositVolt = new EventEmitter();

  toggleFlip() {
    this.flip = (this.flip == 'inactive') ? 'active' : 'inactive';
  }
  
  @Input() volt: AllMainnetVolt;
  public voltTemp: AllMainnetVolt;
  @Input() highVolt: AllMainnetVolt | null;
  @Input() isConnected: boolean = false;

  
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
    this.progress = this.volt.tvlUsd / this.volt.capacityUsd;
    this.totalDepositUsd = this.volt.tvlUsd.toLocaleString();
    
    // store initial volt value
    this.voltTemp = this.volt;
  }

  async getDepositTokenIcon(): Promise<string> {
    return await (await firstValueFrom(this._dataAggregator.getCoinData(this.volt.depositTokenCoingeckoId))).image.large;
  }
  async getUnderlineTokenIcon(): Promise<string> {
    if(this.volt.depositTokenSymbol != this.volt.underlyingTokenSymbol){
      return await (await firstValueFrom(this._dataAggregator.getCoinData(this.volt.underlyingTokenCoingeckoId))).image.large;
    }
    return null
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
