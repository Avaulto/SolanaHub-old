import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  LoaderComponent, WalletAdapterOptionsComponent, WalletConnectComponent, WalletConnectedDropdownComponent, WalletNotConnectedStateComponent } from './components';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [
    WalletConnectComponent,
    WalletAdapterOptionsComponent,
    WalletConnectedDropdownComponent,
    WalletNotConnectedStateComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    LoaderComponent,
  ],
  exports:[
    WalletConnectComponent,
    WalletAdapterOptionsComponent,
    WalletConnectedDropdownComponent,
    WalletNotConnectedStateComponent,
  ]
})
export class WalletModule { }
