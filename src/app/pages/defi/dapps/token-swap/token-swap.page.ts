
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faArrowUpLong } from '@fortawesome/free-solid-svg-icons';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { RouteInfo } from '@jup-ag/core'
import { LAMPORTS_PER_SOL, VersionedTransaction, } from '@solana/web3.js';
import { BehaviorSubject, distinctUntilChanged, filter, firstValueFrom, interval, map, mergeMap, of, pipe, ReplaySubject, Subject, switchMap, tap } from 'rxjs';
import { SolanaUtilsService, JupiterStoreService, UtilsService, TxInterceptService } from 'src/app/services';

import { Token, TokenBalance } from '../../../../models';
import { SwapDetail } from 'src/app/models/swapDetails.model';
import Decimal from "decimal.js";


import Plausible from 'plausible-tracker'
import { DecimalPipe } from '@angular/common';
const { trackEvent } = Plausible();


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

  private _bestRoute: RouteInfo;
  private _swapDetail$: ReplaySubject<SwapDetail> = new ReplaySubject(1);
  public calcLoader: BehaviorSubject<boolean> = new BehaviorSubject(false as boolean)
  public outputAmount;
  public swapDetailObs$ = this._swapDetail$.asObservable()
  public swapForm: FormGroup = {} as FormGroup;
  public tokenList$: BehaviorSubject<Token[]> = new BehaviorSubject([] as Token[]);


  private _reloadCalcRoutes = this.swapDetailObs$.pipe(
    this._utilService.isNotNull,
    distinctUntilChanged(),
    switchMap(() => interval(15000)),
  ).subscribe(() => this.calcRoutes())

  constructor(
    private _solanaUtilService: SolanaUtilsService,
    private _walletStore: WalletStore,
    private _utilService: UtilsService,
    private _fb: FormBuilder,
    private _jupStore: JupiterStoreService,
    private _txInterceptService: TxInterceptService,
    private _decimalPipe: DecimalPipe,
  ) { }
  async ionViewWillEnter() {
    const tokens = await this._jupStore.fetchTokenList();
    const tokensListPrep: any = await this._prepTokenItem(tokens)
    this.tokenList$.next(tokensListPrep);
    this._setDefualtSwapPairs(tokensListPrep)
  }

  async ngOnInit() {

    this.swapForm = this._fb.group({
      inputToken: ['', [Validators.required]],
      outputToken: ['', [Validators.required]],
      inputAmount: ['', [Validators.required]],
      slippage: [0.5, [Validators.required]],
    })

    this._walletStore.anchorWallet$.pipe(this._utilService.isNotNull).subscribe(async wallet => {
      if (wallet) {

        this.wallet = wallet
        this._jupStore.initJup(wallet)
        // add balance
        const tokensListPrep: any = await this._prepTokenItem(this.tokenList$.value)
        this.tokenList$.next(tokensListPrep);
        this._setDefualtSwapPairs(tokensListPrep)
      } else {
        this.wallet = null;
        const tokensListPrep: any = await this._prepTokenItem(this.tokenList$.value)
        this.tokenList$.next(tokensListPrep);
        this._setDefualtSwapPairs(tokensListPrep)
      }
    })
  }




  public pairOne: string = 'solana';
  public pairTwo: string = 'usd-coin';
  private _setDefualtSwapPairs(tokensList) {
    const filterSolToken = tokensList.filter(token => token.address == this.wSOL)[0];
    const filterUsdcToken = tokensList.filter(token => token.address == this.usdc)[0];
    this.swapForm.controls.inputToken.setValue(filterSolToken);
    this.swapForm.controls.outputToken.setValue(filterUsdcToken);

    // this.swapForm
    this.swapForm.valueChanges.subscribe(form => {
      this.pairOne = form.inputToken?.extensions?.coingeckoId || null;
      this.pairTwo = form.outputToken?.extensions?.coingeckoId || null;
      if (this.swapForm.valid) {
        this.calcRoutes()
      } else {
        this._swapDetail$.next(null);
        this.calcLoader.next(false);
        this._reloadCalcRoutes.unsubscribe();
      }

    })
  }

  private async _getTokenBalance(token: Token): Promise<TokenBalance[]> {
    try {
      const walletOwner = await (await firstValueFrom(this._walletStore.anchorWallet$)).publicKey;
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
      console.log(tokenBalance)
      // let { name, logoURI, symbol, balance } = token
      // const tokenExtended = {...token, balance: this._utilService.shortenNum(tokenBalance) }
      // return this._prepTokenData(tokenExtended)
      const name = token.name == 'Wrapped SOL' ? 'Solana' : token.name;
      const tokenListItem: any = { ...token, name, selectable: true, image: token.logoURI, extraData: { symbol: token.symbol } }
      this.wallet ? tokenListItem.extraData.balance = this._decimalPipe.transform(tokenBalance, '1.2-2') : delete tokenListItem.extraData.balance;
      console.log(tokenListItem)
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
      this._bestRoute = await this._jupStore.computeBestRoute(inputAmount, inputToken, outputToken)

      // hide the loader
      this.calcLoader.next(false)

      // prep output amount on UI
      this.outputAmount = new Decimal(this._bestRoute.outAmount.toString())
        .div(10 ** outputToken.decimals).toFixed(3)
    } catch (error) {
      console.error(error)
    }
    const swapDetails = await this._prepSwapDetails(this._bestRoute, this.outputAmount);
    this._swapDetail$.next(swapDetails);
  }
  public setMaxAmount(token: Token): void {
    this.swapForm.controls.inputAmount.setValue(token.balance);
  }
  public async submitSwap(): Promise<void> {

    const transaction: VersionedTransaction = await this._jupStore.swapTx(this._bestRoute);
    console.log(transaction)
    // this.wallet.signTransaction(transaction)
    // Execute the transactions
    // const { setupTransaction, swapTransaction, cleanupTransaction } = transactions
    // const arrayOfTx: Transaction[] = []
    // for (let transaction of [setupTransaction, swapTransaction, cleanupTransaction].filter(Boolean)) {
    //   if (!transaction) {
    //     continue;
    //   }
    //   arrayOfTx.push(transaction)
    // }
    await this._txInterceptService.sendTx2(transaction, this.wallet.publicKey);
    //  await this._txInterceptService.sendTx([transaction], this.wallet.publicKey);
    trackEvent('jupiter swap')
  }
  private async _prepSwapDetails(routeInfo: RouteInfo, outputAmount: number) {
    const { marketInfos } = routeInfo
    try {
      const txFees = await routeInfo.getDepositAndFee();
      const feesByToken: Token = this.tokenList$.value.filter(token => token.address == marketInfos[0].lpFee.mint)[0] || null;

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
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this._reloadCalcRoutes.unsubscribe();
  }
}
