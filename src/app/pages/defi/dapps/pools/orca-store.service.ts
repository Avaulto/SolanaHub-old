import { Injectable } from '@angular/core';
import { DecimalUtil, Percentage, TokenUtil } from '@orca-so/common-sdk';
import { buildWhirlpoolClient, increaseLiquidityQuoteByInputTokenWithParams, PDAUtil, PriceMath, WhirlpoolClient, WhirlpoolContext } from '@orca-so/whirlpools-sdk';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import Decimal from 'decimal.js';
import { catchError, map, Observable, shareReplay, throwError } from 'rxjs';
import { toastData } from 'src/app/models';
import { ApiService, SolanaUtilsService, ToasterService, TxInterceptService, UtilsService } from 'src/app/services';
import { environment } from 'src/environments/environment';
import { OrcaWhirlPool, Whirlpool } from './orca.model';

@Injectable({
  providedIn: 'root'
})
export class OrcaStoreService {

  constructor(
    private _apiService: ApiService,
    private _toasterService: ToasterService,
    private _utilsService: UtilsService,
    private _solanaUtilsService: SolanaUtilsService,
    private _txInterceptService: TxInterceptService
  ) { }
  public orcaContext: WhirlpoolContext;
  public orcaClient: WhirlpoolClient;
  public orcaProgramId = new PublicKey(environment.orcaWhirlPool.programId);
  public orcaConfig = new PublicKey(environment.orcaWhirlPool.config);
  // catch error
  private _formatErrors(error: any) {
    const toastData: toastData = {
      message: error.message,
      icon: 'alert-circle-outline',
      segmentClass: "toastError",

    }
    this._toasterService.msg.next(toastData);
    return throwError((() => error))
  }
  public fetchPools(): Observable<OrcaWhirlPool> {
    return this._apiService.get(environment.orcaWhirlPool.poolAPI)
      .pipe(
        this._utilsService.isNotUndefined,
        this._utilsService.isNotNull,
        catchError(this._formatErrors)
      );
  }
  public async getATA() {
    const token_accounts = (await this.orcaContext.connection.getTokenAccountsByOwner(this.orcaContext.wallet.publicKey, { programId: TOKEN_PROGRAM_ID })).value;
    return token_accounts;
  }
  public async fetchOpenPositions(token_accounts, allPools: Whirlpool[]) {
    const orcaCtx = this.orcaContext;
    // Get all token accounts
    const whirlpool_position_candidate_pubkeys = token_accounts.map((ta) => {
      const parsed = TokenUtil.deserializeTokenAccount(ta.account.data);

      // Derive the address of Whirlpool's position from the mint address (whether or not it exists)
      const pda = PDAUtil.getPosition(orcaCtx.program.programId, parsed.mint);

      // Output candidate info
      // console.log(
      //   "TokenAccount:", ta.pubkey.toBase58(),
      //   "\n  mint:", parsed.mint.toBase58(),
      //   "\n  amount:", parsed.amount.toString(),
      //   "\n  pda:", pda.publicKey.toBase58()
      // );

      // Returns the address of the Whirlpool position only if the number of tokens is 1 (ignores empty token accounts and non-NFTs)
      return new BN(parsed.amount.toString()).eq(new BN(1)) ? pda.publicKey : undefined;
    }).filter(pubkey => pubkey !== undefined);

    // Get data from Whirlpool position addresses
    const whirlpool_position_candidate_datas = await orcaCtx.fetcher.listPositions(whirlpool_position_candidate_pubkeys, true);
    // console.log(whirlpool_position_candidate_pubkeys, whirlpool_position_candidate_datas)
    // Leave only addresses with correct data acquisition as position addresses
    const whirlpool_positions = whirlpool_position_candidate_datas.filter((pubkey, i) =>
      whirlpool_position_candidate_datas[i] !== null
    );

    // Output the address of the positions
    const activePools = whirlpool_positions.map(position => {
      const findPoolWithPosition = allPools.find(pool => pool.address == position.whirlpool.toBase58())
      const poolWithPosition = { ...findPoolWithPosition, ...position }
      return poolWithPosition
    });
    return activePools
  }
  public initOrca(wallet) {
    const programIdPK = new PublicKey(environment.orcaWhirlPool.programId)
    this.orcaContext = WhirlpoolContext.from(this._solanaUtilsService.connection, wallet, programIdPK);
    this.orcaClient = buildWhirlpoolClient(this.orcaContext);
  }
  public async addLiquidity(tokenA, tokenB) {
    const client = this.orcaClient;


    // Get tokenA/tokenB whirlpool
    const tick_spacing = 64;
    const whirlpool_pubkey = PDAUtil.getWhirlpool(
      this.orcaProgramId,
      this.orcaConfig,
      tokenA.mint, tokenB.mint, tick_spacing).publicKey;
    console.log("whirlpool_key:", whirlpool_pubkey.toBase58());
    const whirlpool = await client.getPool(whirlpool_pubkey);

    // Get the current price of the pool
    const sqrt_price_x64 = whirlpool.getData().sqrtPrice;
    const price = PriceMath.sqrtPriceX64ToPrice(sqrt_price_x64, tokenA.decimals, tokenB.decimals);
    console.log("price:", price.toFixed(tokenB.decimals));

    // Set price range, amount of tokens to deposit, and acceptable slippage
    const lower_price = new Decimal("0.005");
    const upper_price = new Decimal("0.02");
    const dev_usdc_amount = DecimalUtil.toU64(new Decimal("1" /* tokenB */), tokenB.decimals);
    const slippage = Percentage.fromFraction(10, 1000); // 1%

    // Adjust price range (not all prices can be set, only a limited number of prices are available for range specification)
    // (prices corresponding to InitializableTickIndex are available)
    const whirlpool_data = whirlpool.getData();
    const token_a = whirlpool.getTokenAInfo();
    const token_b = whirlpool.getTokenBInfo();
    const lower_tick_index = PriceMath.priceToInitializableTickIndex(lower_price, token_a.decimals, token_b.decimals, whirlpool_data.tickSpacing);
    const upper_tick_index = PriceMath.priceToInitializableTickIndex(upper_price, token_a.decimals, token_b.decimals, whirlpool_data.tickSpacing);
    console.log("lower & upper tick_index", lower_tick_index, upper_tick_index);
    console.log("lower & upper price",
      PriceMath.tickIndexToPrice(lower_tick_index, token_a.decimals, token_b.decimals).toFixed(token_b.decimals),
      PriceMath.tickIndexToPrice(upper_tick_index, token_a.decimals, token_b.decimals).toFixed(token_b.decimals)
    );

    // Obtain deposit estimation
    const quote = increaseLiquidityQuoteByInputTokenWithParams({
      // Pass the pool definition and state
      tokenMintA: token_a.mint,
      tokenMintB: token_b.mint,
      sqrtPrice: whirlpool_data.sqrtPrice,
      tickCurrentIndex: whirlpool_data.tickCurrentIndex,
      // Price range
      tickLowerIndex: lower_tick_index,
      tickUpperIndex: upper_tick_index,
      // Input token and amount
      inputTokenMint: tokenB.mint,
      inputTokenAmount: dev_usdc_amount,
      // Acceptable slippage
      slippageTolerance: slippage,
    });

    // Output the estimation
    console.log("tokenA max input", DecimalUtil.fromU64(quote.tokenMaxA, token_a.decimals).toFixed(token_a.decimals));
    console.log("tokenB max input", DecimalUtil.fromU64(quote.tokenMaxB, token_b.decimals).toFixed(token_b.decimals));

    // Create a transaction
    const open_position_tx = await whirlpool.openPositionWithMetadata(
      lower_tick_index,
      upper_tick_index,
      quote
    );

    // Send the transaction
    const tx = await open_position_tx.tx.build()
    console.log("signature:", tx);
    console.log("position NFT:", open_position_tx.positionMint.toBase58());

    // Wait for the transaction to complete
    const res = await this._txInterceptService.sendTx([tx.transaction], this.orcaContext.provider.publicKey, tx.signers)
    console.log('tx done', res)
  }
}
