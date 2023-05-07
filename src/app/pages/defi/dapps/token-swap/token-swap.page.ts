
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouteInfo } from '@jup-ag/core'
import { LAMPORTS_PER_SOL, Transaction } from '@solana/web3.js';
import { BehaviorSubject, combineLatestWith, distinctUntilChanged, filter, firstValueFrom, interval, Observable, ReplaySubject, shareReplay, Subject, switchMap, tap } from 'rxjs';
import { SolanaUtilsService, JupiterStoreService, UtilsService, TxInterceptService } from 'src/app/services';

import { Token, TokenBalance } from '../../../../models';
import { SwapDetail } from 'src/app/models/swapDetails.model';
import Decimal from "decimal.js";
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-token-swap',
  templateUrl: './token-swap.page.html',
  styleUrls: ['./token-swap.page.scss'],
})
export class TokenSwapPage implements OnInit {
  constructor(
    private _solanaUtilService: SolanaUtilsService,
    private _utilService: UtilsService,
    private _fb: FormBuilder,
    private _jupStore: JupiterStoreService,
    private _txInterceptService: TxInterceptService,
    private _solanaUtilsService: SolanaUtilsService,
    private $gaService: GoogleAnalyticsService,
    private _titleService: Title,  
  ) { 
  }
  ionViewWillEnter(){
    this._titleService.setTitle('CompactDeFi - swap tokens')
  }
  public wSOL = "So11111111111111111111111111111111111111112";
  public wallet

  public bestRoute: RouteInfo = null;
  private _swapDetail$: ReplaySubject<SwapDetail> = new ReplaySubject(1);
  public calcLoader: BehaviorSubject<boolean> = new BehaviorSubject(false as boolean)
  public outputAmount: number;
  public swapDetailObs$ = this._swapDetail$.asObservable()
  public swapForm: FormGroup = {} as FormGroup;
  public wallet$ = this._solanaUtilsService.walletExtended$
  public tokenList$: Observable<Token[]> = this._jupStore.fetchTokenList().pipe(
    combineLatestWith(this.wallet$),
    distinctUntilChanged(),
    switchMap(async ([tokens, wallet]) => {
      if (wallet) {
        this.wallet = wallet
        this._jupStore.initJup(wallet)
        // reload tokens list
      } else {
        this.wallet = null;
      }
      const tokensListPrep = await this._prepTokenItem(tokens);
      console
      return tokensListPrep
    }),
    shareReplay()
  )

  private _reloadCalcRoutes = this.swapDetailObs$.pipe(
    this._utilService.isNotNull,
    distinctUntilChanged(),
    switchMap(() => interval(15000)),
  )
    .subscribe(() => this.calcRoutes())

  async ngOnInit() {

    this.swapForm = this._fb.group({
      inputToken: ['', [Validators.required]],
      outputToken: ['', [Validators.required]],
      inputAmount: ['', [Validators.required]],
      slippage: [0.5, [Validators.required]]
    })
    this.swapForm.valueChanges.subscribe(form => {
      this.pairOne = form.inputToken?.extensions?.coingeckoId || 'not found';
      this.pairTwo = form.outputToken?.extensions?.coingeckoId || 'not found';
      if (this.swapForm.valid) {
        this.calcRoutes()
      } else {
        this._swapDetail$.next(null);
        this.calcLoader.next(false);
        this._reloadCalcRoutes.unsubscribe();
      }
    })
  }




  public pairOne: string = 'wrapped-solana';
  public pairTwo: string = 'usd-coin';


  private async _getTokenBalance(token: Token): Promise<TokenBalance[]> {
    try {
      const walletOwner =this._solanaUtilService.getCurrentWallet().publicKey;
      const walletBalance = await this._solanaUtilService.connection.getBalance(walletOwner) / LAMPORTS_PER_SOL;
      const solTokenBalance = { tokenPubkey: walletOwner.toBase58(), mintAddress: this.wSOL, balance: walletBalance }
      const accountsBalance = await this._solanaUtilService.getTokenAccountsBalance(this.wallet.publicKey.toBase58(), 'token');
      accountsBalance.push(solTokenBalance)
      return accountsBalance
    } catch (error) {
      console.error(error)
    }
  }

  private async _prepTokenItem(tokens): Promise<Token[]> {
    const tokensWithOwnerBalance = this.wallet ? await this._getTokenBalance(tokens) : [];
    return tokens.map((token: Token) => {
      let tokenBalance = this.wallet ? tokensWithOwnerBalance.find(account => account.mintAddress == token.address)?.balance || 0 : 0;
      const name = token.name == 'Wrapped SOL' ? 'Solana' : token.name;
      const tokenListItem: any = { ...token, name, selectable: true, image: token.logoURI, extraData: { symbol: token.symbol } }
      if(this.wallet){
        tokenListItem.extraData.balance = this._utilService.formatBigNumbers(tokenBalance)
        tokenListItem.balance = tokenBalance
      }else{
        delete tokenListItem.extraData.balance;
        delete tokenListItem.balance
      }
      return tokenListItem
    })
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
    this.outputAmount = null
    this.calcLoader.next(true);
    const { slippage, outputToken, inputToken, inputAmount } = this.swapForm.value;
    try {
      this.bestRoute = await this._jupStore.computeBestRoute(inputAmount, inputToken, outputToken, slippage);
      if (this.bestRoute) {
        // prep output amount on UI
        const calcOutputDecimal = new Decimal(this.bestRoute.outAmount.toString()).div(10 ** outputToken.decimals).toString()
        this.outputAmount = Number(calcOutputDecimal).toFixedNoRounding(2);
        const swapDetails = await this._prepSwapDetails(this.bestRoute, this.outputAmount);
        this._swapDetail$.next(swapDetails);
      }
    } catch (error) {
      console.error(error)
    }
    // hide the loader
    this.calcLoader.next(false)
  }
  public setMaxAmount(token: Token): void {
    const balance = token.balance
    this.swapForm.controls.inputAmount.setValue(balance);
  }
  public async submitSwap(): Promise<void> {

    const transactions: Transaction[] = await this._jupStore.swapTx(this.bestRoute);

    await this._txInterceptService.sendTx(transactions, this.wallet.publicKey);

    this.$gaService.event('jupiter', 'swap', this.swapForm.value.inputToken?.extensions?.coingeckoId +'-'+ this.swapForm.value.outputToken?.extensions?.coingeckoId);

  }
  private async _prepSwapDetails(routeInfo: RouteInfo, outputAmount: number) {
    const { marketInfos } = routeInfo
    try {
      const txFees = await routeInfo.getDepositAndFee();
      // const feesByToken: Token = this.tokenList$.value.filter(token => token.address == marketInfos[0].lpFee.mint)[0] || null;

      const slippagePercentage = ((this.swapForm.value.slippage / 100) - 1) * -1;
      const minimumRecived = Number(outputAmount * slippagePercentage).toFixedNoRounding(2)
      const priceImpact = marketInfos[0].priceImpactPct
      console.log(marketInfos[0])
      const swapDetail: SwapDetail = {
        priceImpact,
        minimumRecived,
        transactionFee: txFees.signatureFee / LAMPORTS_PER_SOL + ' ' + 'SOL',
        AMMfees: (marketInfos[0].lpFee.pct).toFixed(6) + ' ' + 'SOL',
        platformFees: marketInfos[0].platformFee.pct
      }
      return swapDetail;
    } catch (error) {
      console.error(error);
      return error
    }
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this._reloadCalcRoutes.unsubscribe();
  }
}
