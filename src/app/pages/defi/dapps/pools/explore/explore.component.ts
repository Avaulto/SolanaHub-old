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
  @Input() orcaPools: Observable<OrcaWhirlPool>
  @Input() searchTerm: string;
  constructor(private _orcaStoreService: OrcaStoreService,) { }

  ngOnInit() { }
  public async initDepositSetup(pool: Whirlpool) {
    const tokenA = { mint: new PublicKey(pool.tokenA.mint), decimals: pool.tokenA.decimals };
    const tokenB = { mint: new PublicKey(pool.tokenB.mint), decimals: pool.tokenB.decimals };

    this._orcaStoreService.addLiquidity(tokenA,tokenB)
     }
}
