import { Component, OnInit } from '@angular/core';
import { SolanaUtilsService } from 'src/app/services/solana-utils.service';
// import { AccountFetcher, WhirlpoolContext, WhirlpoolsConfigData } from '@orca-so/whirlpools-sdk';
import { WalletStore } from '@heavy-duty/wallet-adapter';
// import { WHIRLPOOL_PROGRAM_ID } from '@jup-ag/core';
// import { getOrca, OrcaFarmConfig, OrcaPoolConfig, Network } from "@orca-so/sdk";

@Component({
  selector: 'app-pools',
  templateUrl: './pools.component.html',
  styleUrls: ['./pools.component.scss'],
})
export class PoolsComponent implements OnInit {

  constructor(
    private _walletStore: WalletStore,
    private solanaUtilsService: SolanaUtilsService
  ) { }

  ngOnInit() {
    // this._walletStore.anchorWallet$.subscribe(wallet => {
    //   if (wallet) {
    //     const orca = getOrca(this.solanaUtilsService.connection);
    //     const orcaSolPool = orca.getPool(OrcaPoolConfig.ORCA_SOL);
    //     console.log(orcaSolPool)
    //     const ctx = WhirlpoolContext.from(this.solanaUtilsService.connection, wallet, WHIRLPOOL_PROGRAM_ID);
    //     const fetcher = new AccountFetcher(connection);
    //     const config: WhirlpoolsConfigData = await fetcher.getConfig(CONFIG_PUBLIC_KEY);

    //     const poolAddress = PDAUtil.getPool(...);
    //     const pool: WhirlpoolData = await fetcher.getPool(poolAddress);

    //     console.log(ctx)
    //   }
    // })
  }

}
