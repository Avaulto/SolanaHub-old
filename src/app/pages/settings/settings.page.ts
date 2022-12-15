import { Component, OnInit, ViewChild } from '@angular/core';
import { ConnectionStore, WalletStore } from '@heavy-duty/wallet-adapter';
import { IonRadio } from '@ionic/angular';
import { ReplaySubject, shareReplay } from 'rxjs';
import { UtilsService } from 'src/app/services';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  public currentRPC = environment.solanaCluster;
  public tritonRPC = 'https://mb-avaulto-cc28.mainnet.rpcpool.com/f72a3ed2-f282-4523-95a0-d4acfcd40f4d';
  public extrNodeRPC = 'https://solana-mainnet.rpc.extrnode.com';
  readonly currentTheme$ = this._utilsService.theme$.pipe(shareReplay(1));
  readonly currentExplorer$ = this._utilsService.explorer$.pipe(shareReplay(1));

  constructor(private _connectionStore: ConnectionStore, private _utilsService:UtilsService) { }

  ngOnInit() {
    // this.theme.ionFocus.subscribe(val =>{
    //   console.log(val);
    // })
  }
  public setRPC(url: string){
    this.currentRPC = url;
    this._connectionStore.setEndpoint(url);
  }
  public setTheme(theme: string){
    this._utilsService.changeTheme(theme)
    // console.log(theme)
  } 
  public setExplorer(name: string){
    this._utilsService.changeExplorer(name)
    // console.log(theme)
  } 
}
