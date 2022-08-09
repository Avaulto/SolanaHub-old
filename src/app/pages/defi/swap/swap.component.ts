
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { faArrowUpLong } from '@fortawesome/free-solid-svg-icons';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { Jupiter, RouteInfo, TOKEN_LIST_URL } from '@jup-ag/core'
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import JSBI from 'jsbi';
import { BehaviorSubject, map, Subject } from 'rxjs';
import { UtilsService } from 'src/app/services';
import { SolanaUtilsService } from 'src/app/services/solana-utils.service';
import { AccountLayout, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { SwapDetail } from 'src/app/shared/models/swapDetails.model';
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
  selector: 'app-swap',
  templateUrl: './swap.component.html',
  styleUrls: ['./swap.component.scss'],
})
export class SwapComponent implements OnInit {
  public arrowUpIcon = faArrowUpLong;
  public wSOL = "So11111111111111111111111111111111111111112";
  public usdc = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
  public wallet;
  private jupiter: Jupiter;
  private bestRoute: RouteInfo;
  public calcLoader:Subject<boolean> = new Subject()
  public outputAmount;
  public swapDetail: SwapDetail;
  constructor(
    private solanaUtilService: SolanaUtilsService,
    private _walletStore: WalletStore,
    private util: UtilsService,
    private fb: FormBuilder,
    private utilsService:UtilsService
  ) { }
  public swapForm: FormGroup;
  ngOnInit() {
    this.calcLoader.next(false)
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

  public async initJup() {
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
  public async fetchTokenList() {
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

    this.swapForm.valueChanges.subscribe(val => {
      console.log(val)
      setTimeout(() => {
        if (val.inputAmount) {
          this.calcRoutes()
        }
      });
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

    // const routeMap: Map<string, string[]> = this.jupiter.getRouteMap();
    // const tokens = [this.swapPair.pairOne, this.swapPair.pairTwo]
    // const inputToken = tokens[0]
    // console.log(tokens, routeMap)
    // const possiblePairsTokenInfo = await this.getPossiblePairsTokenInfo({
    //   tokens,
    //   routeMap,
    //   inputToken,
    // });
    // console.log(possiblePairsTokenInfo)
  }


  private async getTokenBalance(tokens: Token[]) {
    // const tokenAccounts = await this.solanaUtilService.connection.getTokenAccountsByOwner(
    //   this.wallet.publicKey,
    //   {
    //     programId: TOKEN_PROGRAM_ID,
    //   }
    // );

    // console.log("Token                                         Balance");
    // console.log("------------------------------------------------------------");
    // tokenAccounts.value.forEach(async (tokenAccount) => {
    //   const accountData = AccountLayout.decode(tokenAccount.account.data);
    //   console.log(`${new PublicKey(accountData.mint)}  AMOUNT  ${accountData.amount}`);
    //   let tokenAmount = await this.solanaUtilService.connection.getTokenAccountBalance(new PublicKey(accountData.mint));
    //   console.log(tokenAmount)
    // })
    // let tokenAmount = await this.solanaUtilService.connection.getTokenAccountBalance(new PublicKey(accountData.mint));

    // const splAccounts = await this.solanaUtilsService.getTokensAccountbyOwner(this.wallet.publicKey);
    // splAccounts.filter(async spl =>{
    //    const tokenAddress = spl.account.data['parsed'].info.mint
    //    let tokenAmount = await this.solanaUtilService.connection.getTokenAccountBalance(new PublicKey(tokenAddress));
    //   console.log(tokenAmount)
    //   });
    // const ownedTokens = tokens.map((token, index) => {
    //   return splAccounts.filter(spl => spl.account.data['parsed'].info.mint == token.address);
    //   // console.log(owned)
    // })
    // console.log(ownedTokens)
    // tokens.find(token => token.address == )
    // this.solBalance = this.utilsService.fixedNum(((await this.solanaUtilsService.connection.getBalance(this.wallet.publicKey)) / LAMPORTS_PER_SOL));
    // const marinadeSPL = "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So"
    // this.mSOLBalance = splAccounts.filter(account => account.account.data['parsed'].info.mint == marinadeSPL)[0].account.data['parsed'].info.tokenAmount.amount / LAMPORTS_PER_SOL

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
    this.outputAmount = null
    this.calcLoader.next(true);
    const { slippage, outputToken, inputToken, inputAmount } = this.swapForm.value;

    const amount = inputAmount * (10 ** inputToken.decimals)
    const routes = await this.jupiter.computeRoutes({
      inputMint: new PublicKey(inputToken.address),
      outputMint: new PublicKey(outputToken.address),
      amount: JSBI.BigInt(amount), // 1000000 => 1 USDC if inputToken.address is USDC mint
      slippage, // 1 = 1%
      //forceFetch: true,// (optional) to force fetching routes and not use the cache
      // intermediateTokens, if provided will only find routes that use the intermediate tokens
      // feeBps
    });
    this.bestRoute = routes.routesInfos[0]
    this.prepSwapInfo(this.bestRoute, outputToken.decimals);
    console.log(this.bestRoute)
    this.calcLoader.next(false)

    this.outputAmount = (routes.routesInfos[0].outAmount[0] / (10 ** outputToken.decimals)).toFixed(3)
    const { transactions } = await this.jupiter.exchange({
      routeInfo: this.bestRoute
    });
    console.log(transactions)

    // Execute swap
    // const swapResult: any = await execute(); // Force any to ignore TS misidentifying SwapResult type
    // console.log(swapResult)
    // if (swapResult.error) {
    //   console.log(swapResult.error);
    // } else {
    //   console.log(`https://explorer.solana.com/tx/${swapResult.txid}`);
    //   console.log(`inputAddress=${swapResult.inputAddress.toString()} outputAddress=${swapResult.outputAddress.toString()}`);
    //   console.log(`inputAmount=${swapResult.inputAmount} outputAmount=${swapResult.outputAmount}`);
    // }
  }
  private async prepSwapInfo(routeInfo: RouteInfo, multiplier: number){
    const {marketInfos} = routeInfo
    const txFees = await routeInfo.getDepositAndFee();
    const feesByToken: Token = this.tokensList.value.filter(token => token.address == marketInfos[0].lpFee.mint)[0] || null;

    // console.log(marketInfos,txFees)
    // Number(marketInfos[0].outputMint) * this.swapForm.value.slippage
    const slippagePercentage = ((this.swapForm.value.slippage / 100) - 1) *-1;
    const minimumRecived =  (Number(marketInfos[0].outAmount[0] / (10 ** multiplier)) * slippagePercentage).toFixed(3)//  / (10 ** outputToken.decimals)
    const priceImpact =  marketInfos[0].priceImpactPct
    console.log(priceImpact)
    let priceImpactScore = priceImpact < 0.001 ? 'excelent' : 'bad';
    const swapDetail: SwapDetail = {
      priceImpact: priceImpactScore,
      minimumRecived, 
      transactionFee:  txFees.signatureFee / LAMPORTS_PER_SOL + ' ' + 'SOL',
      AMMfees: (marketInfos[0].lpFee.pct).toFixed(6) + ' ' + feesByToken.symbol,
      platformFees: marketInfos[0].platformFee.pct
    }

    this.swapDetail = swapDetail
  }
}