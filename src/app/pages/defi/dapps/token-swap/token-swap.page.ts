
import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,  Validators } from '@angular/forms';
import { faArrowUpLong } from '@fortawesome/free-solid-svg-icons';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { Jupiter, RouteInfo, TOKEN_LIST_URL } from '@jup-ag/core'
import {  LAMPORTS_PER_SOL, PublicKey, Transaction } from '@solana/web3.js';
import JSBI from 'jsbi';
import { BehaviorSubject, distinctUntilChanged, filter, firstValueFrom, interval, map, of, pipe, ReplaySubject, Subject, switchMap, tap } from 'rxjs';
import { ApiService, UtilsService } from 'src/app/services';
import { SolanaUtilsService } from 'src/app/services/solana-utils.service';

import {  TokenBalance } from '../../../../models';
import { SwapDetail } from 'src/app/models/swapDetails.model';
import { TxInterceptService } from 'src/app/services/txIntercept.service';
import Decimal from "decimal.js";


import Plausible from 'plausible-tracker'
const { trackEvent } = Plausible();



export interface Token {
  chainId: number; // 101,
  address: string; // 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  symbol: string; // 'USDC',
  name: string; // 'Wrapped USDC',
  decimals: number; // 6,
  logoURI: string; // 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/BXXkv6z8ykpG1yuvUDPgh732wzVHB69RnB9YgSYh3itW/logo.png',
  tags: string[]; // [ 'stablecoin' ]
  token: Token;
  balance?: number;
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
  private _jupiter: Jupiter;
  private _bestRoute: RouteInfo;
  private _swapDetail$: ReplaySubject<SwapDetail> = new ReplaySubject(1);
  public calcLoader: BehaviorSubject<boolean> = new BehaviorSubject(false as boolean)
  public outputAmount;
  public swapDetailObs$ = this._swapDetail$.asObservable()
  public swapForm: FormGroup = {} as FormGroup;
  public tokensList = new BehaviorSubject([] as Token[]);
  public currentTokenList = this.tokensList.asObservable()

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
    private _txInterceptService: TxInterceptService,
  ) { }
  ngOnInit() {
    this.swapForm = this._fb.group({
      inputToken: ['', [Validators.required]],
      outputToken: ['', [Validators.required]],
      inputAmount: ['', [Validators.required]],
      slippage: [0.5, [Validators.required]],
    })

    this._walletStore.anchorWallet$.pipe(this._utilService.isNotNull).subscribe(wallet => {
      if(wallet){

        this.wallet = wallet
        this._initJup()
        this._fetchTokenList()
      }else{
        this.wallet = null;
      }
    })
  }

  private async _initJup() {
    const connection = this._solanaUtilService.connection;
    const pk = this.wallet.publicKey// this._walletStore.anchorWallet$.pipe(switchMap(wallet => wallet.publicKey))
    try {
      this._jupiter = await Jupiter.load({
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

  private async _fetchTokenList() {
    const tokens: Token[] = await (await fetch(TOKEN_LIST_URL['mainnet-beta'])).json();
    // const tokensWithOwnerBalance = await this.getTokenBalance(tokens);
    const tokensListPrep = await this._prepTokenList(tokens);
    this.tokensList.next(tokensListPrep);
    this._setDefualtSwapPairs(tokensListPrep)

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
    const walletOwner = await (await firstValueFrom(this._walletStore.anchorWallet$)).publicKey;
    const walletBalance = await this._solanaUtilService.connection.getBalance(walletOwner) / LAMPORTS_PER_SOL;
    const solTokenBalance = {tokenPubkey:walletOwner.toBase58(), mintAddress: this.wSOL, balance: walletBalance}
    const accountsBalance = await this._solanaUtilService.getTokenAccountsBalance(this.wallet.publicKey.toBase58());
    accountsBalance.push(solTokenBalance)
    return accountsBalance
  }

  private async _prepTokenList(tokens): Promise<Token[]> {
    const tokensWithOwnerBalance = await this._getTokenBalance(tokens);
    return tokens.map((token: Token) => {
      let tokenBalance =  tokensWithOwnerBalance.find(account => account.mintAddress == token.address)?.balance || 0;
      const tokenExtended = {...token, balance: this._utilService.shortenNum(tokenBalance) }
      return this._prepTokenData(tokenExtended)
    })
  }
  private _prepTokenData(token) {

    let { name, logoURI, symbol, balance } = token

    name = name == 'Wrapped SOL' ? 'Solana' : name;

    return { ...token, name, selectable: true, symbol, image: logoURI, extraData: { symbol, balance } }
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
    const inputAmountInSmallestUnits = inputToken
      ? Math.round(Number(inputAmount) * 10 ** inputToken.decimals)
      : 0;
    try {
      const routes = await this._jupiter.computeRoutes({
        inputMint: new PublicKey(inputToken.address),
        outputMint: new PublicKey(outputToken.address),
        amount: JSBI.BigInt(inputAmountInSmallestUnits),
        slippage: 1, // 1 = 1%
        forceFetch: true, // (optional) to force fetching routes and not use the cache
        // intermediateTokens, if provided will only find routes that use the intermediate tokens
        // feeBps
      });
      //stare best route
      this._bestRoute = routes.routesInfos[0]

      // hide the loader
      this.calcLoader.next(false)

      // prep output amount on UI
      this.outputAmount = new Decimal(routes.routesInfos[0].outAmount.toString())
        .div(10 ** outputToken.decimals).toFixed(3)
    } catch (error) {
      console.error(error)
    }
    const swapDetails = await this._prepSwapDetails(this._bestRoute, this.outputAmount);
    this._swapDetail$.next(swapDetails);
  }
  public setMaxAmount(token: Token): void {
    // const fixedAmount = this._utilsService.shortenNum(this.wallet.balance - 0.0001)
    this.swapForm.controls.inputAmount.setValue(token.balance);
  }
  public async submitSwap(): Promise<void> {

    const { transactions } = await this._jupiter.exchange({
      routeInfo: this._bestRoute
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
     await this._txInterceptService.sendTx(arrayOfTx, this.wallet.publicKey);
     trackEvent('jupiter swap')
  }
  private async _prepSwapDetails(routeInfo: RouteInfo, outputAmount: number) {
    const { marketInfos } = routeInfo
    try {
      const txFees = await routeInfo.getDepositAndFee();
      const feesByToken: Token = this.tokensList.value.filter(token => token.address == marketInfos[0].lpFee.mint)[0] || null;

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
