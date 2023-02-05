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
  public tritonRPC = 'https://mb-avaulto-cc28.mainnet.rpcpool.com/f72a3ed2-f282-4523-95a0-d4acfcd40f4d';
  public extrNodeRPC = 'https://solana-mainnet.rpc.extrnode.com';
  public currenTheme$ = this._utilsService.systemTheme$.pipe(shareReplay(1));
  public currentPrioretyFee = this._utilsService.priorityFee
  readonly currentExplorer$ = this._utilsService.explorer$.pipe(shareReplay(1));

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
      icon: 'information-circle-outline',
      segmentClass: "toastInfo"
    }
    this._toasterService.msg.next(toasterMessage)
  }
  public setTheme(name: string) {
    this._utilsService.changeTheme(name);
    const toasterMessage: toastData = {
      message: 'Theme updated',
      icon: 'information-circle-outline',
      segmentClass: "toastInfo"
    }
    this._toasterService.msg.next(toasterMessage)
  }
  public setExplorer(name: string) {
    this._utilsService.changeExplorer(name)
    const toasterMessage: toastData = {
      message: 'Explorer updated',
      icon: 'information-circle-outline',
      segmentClass: "toastInfo"
    }
    this._toasterService.msg.next(toasterMessage)
  }

  public setPriorityFee(rank: string) {
    this._utilsService.priorityFee = PriorityFee[rank];
    this.currentPrioretyFee = PriorityFee[rank];

    const toasterMessage: toastData = {
      message: 'Priority fee updated',
      icon: 'information-circle-outline',
      segmentClass: "toastInfo"
    }
    this._toasterService.msg.next(toasterMessage)
  }
}
