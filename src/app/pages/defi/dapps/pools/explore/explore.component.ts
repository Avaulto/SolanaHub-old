import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { PublicKey } from '@solana/web3.js';
import { Observable } from 'rxjs';
import { OrcaStoreService } from '../orca-store.service';
import { OrcaWhirlPool, Whirlpool } from '../orca.model';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss'],
  animations: [
    // the fade-in/fade-out animation.
    trigger('simpleFadeAnimation', [

      // the "in" style determines the "resting" state of the element when it is visible.
      state('in', style({opacity: 1})),

      // fade in when created. this could also be written as transition('void => *')
      transition(':enter', [
        style({opacity: 0}),
        animate(600 )
      ]),

      // fade out when destroyed. this could also be written as transition('void => *')
      transition(':leave',
        animate(600, style({opacity: 0})))
    ])
  ]
})
export class ExploreComponent implements OnInit {
  @Input() orcaPools: Observable<OrcaWhirlPool>
  @Input() searchTerm: string;
  constructor(private _orcaStoreService: OrcaStoreService) { }

  ngOnInit() { }
  public async initDepositSetup(pool: Whirlpool) {
    const tokenA = { mint: new PublicKey(pool.tokenA.mint), decimals: pool.tokenA.decimals };
    const tokenB = { mint: new PublicKey(pool.tokenB.mint), decimals: pool.tokenB.decimals };

    this._orcaStoreService.addLiquidity(tokenA,tokenB)
     }
}
