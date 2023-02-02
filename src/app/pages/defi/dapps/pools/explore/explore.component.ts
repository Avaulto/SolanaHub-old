import { Component, Input, OnInit } from '@angular/core';
import { DecimalUtil, Percentage } from '@orca-so/common-sdk';
import { buildWhirlpoolClient, increaseLiquidityQuoteByInputToken, increaseLiquidityQuoteByInputTokenWithParams, PDAUtil, PriceMath, TickUtil, WhirlpoolClient, WhirlpoolContext } from '@orca-so/whirlpools-sdk';
import { PublicKey } from '@solana/web3.js';
import Decimal from 'decimal.js';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OrcaStoreService } from '../orca-store.service';
import { OrcaWhirlPool, Whirlpool } from '../orca.model';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss'],
})
export class ExploreComponent implements OnInit {
  @Input() orcaDataset: Observable<OrcaWhirlPool>
  @Input() searchTerm: string;
  constructor(private _orcaStoreService: OrcaStoreService,) { }

  ngOnInit() { }
  public async initDepositSetup(pool: Whirlpool) {
    this._orcaStoreService.addLiquidity()
     }
}
