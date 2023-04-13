import { Component, OnInit } from '@angular/core';
import { ConnectionStore } from '@heavy-duty/wallet-adapter';
import { shareReplay } from 'rxjs';
import { toastData } from 'src/app/models';
import { PriorityFee } from 'src/app/models/priorityFee.model';
import { ToasterService, UtilsService } from 'src/app/services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-options-popup',
  templateUrl: './options-popup.component.html',
  styleUrls: ['./options-popup.component.scss'],
})
export class OptionsPopupComponent implements OnInit {

  public currentRPC = environment.solanaCluster;
  public currenTheme$ = this._utilsService.systemTheme$.pipe(shareReplay(1));
  public currentPrioretyFee = this._utilsService.priorityFee
  readonly currentExplorer$ = this._utilsService.explorer$.pipe(shareReplay(1));

  public RPC_list = [{
    name:'triton',
    imageUrl: 'assets/images/icons/triton-logo.svg',
    url:'https://mb-avaulto-cc28.mainnet.rpcpool.com'
  },
  {
    name:'extrnode',
    imageUrl: 'assets/images/icons/extrnode.svg',
    url:'https://solana-mainnet.rpc.extrnode.com'

  },

]
  public explorerList = [
    {
      name:'solanafm',
      imageUrl: 'assets/images/icons/solana-fm.svg',
      url:'https://solana.fm'
    },
    {
      name:'xRay',
      imageUrl: 'assets/images/icons/xray-logo.png',
      url:'https://xray.helius.xyz/'
    },
    {
      name:'solscan',
      imageUrl: 'assets/images/icons/solscan.svg',
      url:'https://solscan.io'
    },
    {
    name:'offical',
    imageUrl: 'assets/images/icons/solana-explorer2.png',
    url:'https://explorer.solana.com'
  }]

  constructor(
    private _connectionStore: ConnectionStore,
    private _toasterService: ToasterService,
    private _utilsService: UtilsService) { }

  ngOnInit() {

  }
  public setRPC(url: string) {
    this.currentRPC = url;
    this._connectionStore.setEndpoint(url);
    const toasterMessage: toastData = {
      message: 'RPC updated',
      segmentClass: "toastInfo"
    }
    this._toasterService.msg.next(toasterMessage)
  }
  public setTheme(name: string) {
    this._utilsService.changeTheme(name);
    const toasterMessage: toastData = {
      message: 'Theme updated',
      segmentClass: "toastInfo"
    }
    this._toasterService.msg.next(toasterMessage)
  }
  public setExplorer(name: string) {
    this._utilsService.changeExplorer(name)
    const toasterMessage: toastData = {
      message: 'Explorer updated',
      segmentClass: "toastInfo"
    }
    this._toasterService.msg.next(toasterMessage)
  }

  public setPriorityFee(rank: string) {
    this._utilsService.priorityFee = PriorityFee[rank];
    this.currentPrioretyFee = PriorityFee[rank];

    const toasterMessage: toastData = {
      message: 'Priority fee updated',
      segmentClass: "toastInfo"
    }
    this._toasterService.msg.next(toasterMessage)
  }
}
