
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { faArrowUpLong, faSliders } from '@fortawesome/free-solid-svg-icons';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { Jupiter, RouteInfo, TOKEN_LIST_URL } from '@jup-ag/core'
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey, Transaction } from '@solana/web3.js';
import JSBI from 'jsbi';
import { BehaviorSubject, distinctUntilChanged, filter, interval, map, of, pipe, ReplaySubject, Subject, switchMap, tap } from 'rxjs';
import { ApiService, UtilsService } from 'src/app/services';
import { SolanaUtilsService } from 'src/app/services/solana-utils.service';
import { AccountLayout, AccountInfo, TOKEN_PROGRAM_ID } from "@solana/spl-token";

import { SwapDetail } from 'src/app/shared/models/swapDetails.model';
import { TxInterceptService } from 'src/app/services/txIntercept.service';
import Decimal from "decimal.js";
export interface Token {
  chainId: number; // 101,
  address: string; // 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  symbol: string; // 'USDC',
  name: string; // 'Wrapped USDC',
  decimals: number; // 6,
  logoURI: string; // 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/BXXkv6z8ykpG1yuvUDPgh732wzVHB69RnB9YgSYh3itW/logo.png',
  tags: string[]; // [ 'stablecoin' ]
  token: Token
}

@Component({
  selector: 'app-token-swap',
  templateUrl: './token-swap.page.html',
  styleUrls: ['./token-swap.page.scss'],
})
export class TokenSwapPage implements OnInit {

  public arrowUpIcon = faArrowUpLong;
  public wSOL = "So11111111111111111111111111111111111111112";
  public usdc = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
  public wallet;
  private jupiter: Jupiter;
  private bestRoute: RouteInfo;
  public calcLoader: BehaviorSubject<boolean> = new BehaviorSubject(false as boolean)
  public outputAmount;
  private swapDetail$: ReplaySubject<SwapDetail> = new ReplaySubject(1);
  public swapDetailObs$ = this.swapDetail$.asObservable()
  public swapForm: FormGroup = {} as FormGroup;
  private reloadCalcRoutes = this.swapDetailObs$.pipe(
    this.utilsService.isNotNull,
    distinctUntilChanged(),
    switchMap(() => interval(15000)),
  ).subscribe(() => this.calcRoutes())

  constructor(
    private solanaUtilService: SolanaUtilsService,
    private _walletStore: WalletStore,
    private util: UtilsService,
    private fb: FormBuilder,
    private utilsService: UtilsService,
    private txInterceptService: TxInterceptService,
  ) { }
  ngOnInit() {
    this.swapDetailObs$.subscribe(val =>console.log(val))
    this.swapForm = this.fb.group({
      inputToken: ['', [Validators.required]],
      outputToken: ['', [Validators.required]],
      inputAmount: ['', [Validators.required]],
      slippage: [0.5, [Validators.required]],
    })

    this._walletStore.anchorWallet$.pipe(this.util.isNotNull).subscribe(wallet => {
      this.wallet = wallet
      this.initJup()
      this.fetchTokenList()
    })
  }

  private async initJup() {
    const connection = this.solanaUtilService.connection;
    const pk = this.wallet.publicKey// this._walletStore.anchorWallet$.pipe(switchMap(wallet => wallet.publicKey))
    try {
      this.jupiter = await Jupiter.load({
        connection,
        cluster: 'mainnet-beta',
        user: pk, // or public key
        // platformFeeAndAccounts:  NO_PLATFORM_FEE,
        routeCacheDuration: 10_000, // Will not refetch data on computeRoutes for up to 10 seconds
      });
    } catch (error) {
      console.error(error)
    }
  }
  public tokensList = new BehaviorSubject([] as Token[]);
  public currentTokenList = this.tokensList.asObservable()
  private async fetchTokenList() {
    const tokens: Token[] = await (await fetch(TOKEN_LIST_URL['mainnet-beta'])).json();
    const tokensListPrep = this.prepTokenList(tokens);

    this.tokensList.next(tokensListPrep);
    this.setDefualtSwapPairs(tokensListPrep)
    this.getTokenBalance(tokens);

  }
  private setDefualtSwapPairs(tokensList) {
    const filterSolToken = tokensList.filter(token => token.address == this.wSOL)[0];
    const filterUsdcToken = tokensList.filter(token => token.address == this.usdc)[0];
    this.swapForm.controls.inputToken.setValue(filterSolToken);
    this.swapForm.controls.outputToken.setValue(filterUsdcToken);

    // this.swapForm
    this.swapForm.valueChanges.subscribe(form => {
      if (this.swapForm.valid) {
        this.calcRoutes()
      } else {
        this.swapDetail$.next(null);
        this.calcLoader.next(false);
        this.reloadCalcRoutes.unsubscribe();
      }

    })
  }
  private prepTokenList(tokens) {
    return tokens.map(token => {
      return this.prepTokenData(token)
    })
  }
  private prepTokenData(token) {

    let { name, logoURI, symbol } = token
    name = name == 'Wrapped SOL' ? 'Solana' : name;
    return { ...token, name, selectable: true, symbol, image: logoURI, extraData: { symbol } }
  }


  public showCoinsListOne: boolean = false;
  public showCoinsListTwo: boolean = false;
  async setSelectedPair(pair, type: 'outputToken' | 'inputToken') {
    this.swapForm.controls[type].setValue(pair);
    if (type == 'inputToken') {
      this.showCoinsListOne = !this.showCoinsListOne;
    } else {
      this.showCoinsListTwo = !this.showCoinsListTwo;
    }
  }


  private async getTokenBalance(tokens: Token[]) {

    this.solanaUtilService.getTokenAccountsBalance(this.wallet.publicKey.toBase58())
   
  }
  public getPossiblePairsTokenInfo = ({
    tokens,
    routeMap,
    inputToken,
  }: {
    tokens: Token[];
    routeMap: Map<string, string[]>;
    inputToken?: Token;
  }) => {
    try {
      const possiblePairs = routeMap.get(inputToken.address)
      console.log(possiblePairs)
      const possiblePairsTokenInfo: { [key: string]: Token | undefined } = {};
      possiblePairs.forEach((address) => {
        possiblePairsTokenInfo[address] = tokens.find((t) => {
          return t.address == address;
        });
      });

      return possiblePairsTokenInfo;
    } catch (error) {
      throw error;
    }
  };


  public flipPairs() {
    const tempInput = this.swapForm.value.inputToken;
    const tempOutput = this.swapForm.value.outputToken;

    this.swapForm.controls.outputToken.setValue(tempInput);
    this.swapForm.controls.inputToken.setValue(tempOutput);
  }
  async calcRoutes() {
    console.log('calc routes fn')
    this.outputAmount = null
    this.calcLoader.next(true);
    const { slippage, outputToken, inputToken, inputAmount } = this.swapForm.value;
    const inputAmountInSmallestUnits = inputToken
      ? Math.round(Number(inputAmount) * 10 ** inputToken.decimals)
      : 0;
    // console.log(slippage, outputToken, inputToken, inputAmount, amount)
    try {
      const routes = await this.jupiter.computeRoutes({
        inputMint: new PublicKey(inputToken.address),
        outputMint: new PublicKey(outputToken.address),
        amount: JSBI.BigInt(inputAmountInSmallestUnits),
        slippage: 1, // 1 = 1%
        forceFetch: true, // (optional) to force fetching routes and not use the cache
        // intermediateTokens, if provided will only find routes that use the intermediate tokens
        // feeBps
      });
      //stare best route
      this.bestRoute = routes.routesInfos[0]

      // hide the loader
      this.calcLoader.next(false)

      // prep output amount on UI
      this.outputAmount = new Decimal(routes.routesInfos[0].outAmount.toString())
        .div(10 ** outputToken.decimals).toFixed(3)
    } catch (error) {
      console.error(error)
    }
    const swapDetails = await this.prepSwapDetails(this.bestRoute, this.outputAmount);
    this.swapDetail$.next(swapDetails);
  }
  public async submitSwap(): Promise<void> {
    const { transactions } = await this.jupiter.exchange({
      routeInfo: this.bestRoute
    });

    // Execute the transactions
    const { setupTransaction, swapTransaction, cleanupTransaction } = transactions
    const arrayOfTx: Transaction[] = []
    for (let transaction of [setupTransaction, swapTransaction, cleanupTransaction].filter(Boolean)) {
      if (!transaction) {
        continue;
      }
      arrayOfTx.push(transaction)
    }
     this.txInterceptService.sendTx(arrayOfTx, this.wallet.publicKey)
  }
  private async prepSwapDetails(routeInfo: RouteInfo, outputAmount: number) {
    const { marketInfos } = routeInfo
    try {
      const txFees = await routeInfo.getDepositAndFee();
      const feesByToken: Token = this.tokensList.value.filter(token => token.address == marketInfos[0].lpFee.mint)[0] || null;

      // console.log(marketInfos,txFees)
      // Number(marketInfos[0].outputMint) * this.swapForm.value.slippage
      const slippagePercentage = ((this.swapForm.value.slippage / 100) - 1) * -1;
      const minimumRecived: any = (outputAmount * slippagePercentage).toFixedNoRounding(3)//  / (10 ** outputToken.decimals)
      const priceImpact = marketInfos[0].priceImpactPct

      const swapDetail: SwapDetail = {
        priceImpact,
        minimumRecived,
        transactionFee: txFees.signatureFee / LAMPORTS_PER_SOL + ' ' + 'SOL',
        AMMfees: (marketInfos[0].lpFee.pct).toFixed(6) + ' ' + feesByToken.symbol,
        platformFees: marketInfos[0].platformFee.pct
      }
      return swapDetail;
    } catch (error) {
      console.error(error);
      return error
    }
  }
}
