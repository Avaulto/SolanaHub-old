import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { PublicKey } from '@solana/web3.js';
import { firstValueFrom, lastValueFrom, Observable } from 'rxjs';
import { OrcaStoreService } from '../orca-store.service';
import { OrcaWhirlPool, Whirlpool } from '../orca.model';
import { JupiterStoreService } from 'src/app/services';
import { Token } from 'src/app/models';
import { PopoverController } from '@ionic/angular';
import { DepositPopupComponent } from './deposit-popup/deposit-popup.component';
// import { AnchorProvider } from "@friktion-labs/anchor";
@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss'],
  animations: [
    // the fade-in/fade-out animation.
    trigger('simpleFadeAnimation', [

      // the "in" style determines the "resting" state of the element when it is visible.
      state('in', style({ opacity: 1 })),

      // fade in when created. this could also be written as transition('void => *')
      transition(':enter', [
        style({ opacity: 0 }),
        animate(600)
      ]),

      // fade out when destroyed. this could also be written as transition('void => *')
      transition(':leave',
        animate(600, style({ opacity: 0 })))
    ])
  ]
})
export class ExploreComponent implements OnInit {
  @Input() orcaPools: Observable<OrcaWhirlPool>
  @Input() searchTerm: string;
  constructor(
    private _orcaStoreService: OrcaStoreService,
    private _jupiterStoreService: JupiterStoreService,
    private _popoverController: PopoverController
  ) { }
  public tokenList: Token[];
  async ngOnInit() {
    this.tokenList = await lastValueFrom(this._jupiterStoreService.fetchTokenList())
  }
  public async initDepositSetup(pool: Whirlpool) {
    // const icon = this.tokenList.find(icon => icon.address === whirlpool_data.rewardInfos[i].mint.toBase58())
    // const tokenA = { mint: new PublicKey(pool.tokenA.mint), decimals: pool.tokenA.decimals };
    // const tokenB = { mint: new PublicKey(pool.tokenB.mint), decimals: pool.tokenB.decimals };
    console.log('init popup')
    const popover = await this._popoverController.create({
      component: DepositPopupComponent,
      // event: e,
      componentProps:{pool},
      alignment: 'start',
      showBackdrop:false,
      backdropDismiss: true,
      dismissOnSelect: true,
      cssClass: 'merge-accounts-popup',
    });
    await popover.present();
    // this._orcaStoreService.addLiquidity(pool)
  }

}
