
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
  public bestRoute;
  public calcLoader = new Subject()
  public outputAmount;
  constructor(
    private solanaUtilService: SolanaUtilsService,
    private _walletStore: WalletStore,
    private util: UtilsService,
    private fb: FormBuilder
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

  }
  private setDefualtSwapPairs(tokensList){
    const filterSolToken = tokensList.filter(token => token.address == this.wSOL)[0];
    const filterUsdcToken = tokensList.filter(token => token.address == this.usdc)[0];
    this.swapForm.controls.inputToken.setValue(filterSolToken);
    this.swapForm.controls.outputToken.setValue(filterUsdcToken);

    this.swapForm.valueChanges.subscribe(val => {
      console.log(val)
      setTimeout(() => { 
        if(val.inputAmount){
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
  public swapPair: any = {

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
    console.log(this.bestRoute)
    this.calcLoader.next(false)

     this.outputAmount = routes.routesInfos[0].outAmount[0] / (10 ** outputToken.decimals)
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

}