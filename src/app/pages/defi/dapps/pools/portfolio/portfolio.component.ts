import { Component, Input, OnInit } from '@angular/core';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { Wallet } from '@project-serum/anchor';
import { firstValueFrom, Observable, Subscription, switchMap } from 'rxjs';
import { UtilsService } from 'src/app/services';
import { OrcaStoreService } from '../orca-store.service';
import { OrcaWhirlPool } from '../orca.model';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
})
export class PortfolioComponent implements OnInit {
  @Input() orcaPools: Observable<OrcaWhirlPool>
  // @Input() wallet$: Observable<any>;
  public activePools$ = this._wallet.anchorWallet$.pipe(
    this._utilsService.isNotNull,
    this._utilsService.isNotUndefined,
    switchMap(async wallet => {
      const ata = await this._orcaStoreService.getATA();
      const orcaPools = await (await firstValueFrom(this.orcaPools)).whirlpools
      const activePools = await this._orcaStoreService.fetchOpenPositions(ata, orcaPools);
      return activePools
    }))

  constructor(private _orcaStoreService: OrcaStoreService, private _wallet: WalletStore, private _utilsService: UtilsService) { }

  async ngOnInit() {
    console.log('port loaded')


  }

}
