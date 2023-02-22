import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonCheckbox, PopoverController } from '@ionic/angular';
import { Jupiter } from '@jup-ag/core';
import { AddressLookupTableAccount, TransactionBlockhashCtor } from '@solana/web3.js';
import { LAMPORTS_PER_SOL, PublicKey, Transaction, TransactionInstruction, TransactionMessage, VersionedTransaction } from '@solana/web3.js';
import JSBI from 'jsbi';
import { Asset } from 'src/app/models';
import { SolanaUtilsService, TxInterceptService, UtilsService } from 'src/app/services';
import {
  createBurnInstruction,
  createCloseAccountInstruction,
} from "../../../../../node_modules/@solana/spl-token";
@Component({
  selector: 'app-convert-balance-popup',
  templateUrl: './convert-balance-popup.component.html',
  styleUrls: ['./convert-balance-popup.component.scss'],
})
export class ConvertBalancePopupComponent implements OnInit {
  // set all low balance asset to true
  public wSOL = "So11111111111111111111111111111111111111112";
  public checkAll: boolean = true
  @Input() assets: Asset[];
  @Input() wallet: {
    publicKey: PublicKey;
    signTransaction: (transaction: Transaction) => Promise<Transaction>;
    signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
  };
  // @Input() wallet
  public rentAccountSize = 2039280 / LAMPORTS_PER_SOL;

  public assetsListCanSwap: Asset[] = []
  public selectedAssets: Asset[] = [];
  public totalSOLConvert = 0;
  constructor(
    private _txInterceptService: TxInterceptService,
    private _popoverController: PopoverController,
    private _solanaUtilsService: SolanaUtilsService,
    private _utilsService: UtilsService
  ) { }

  ngOnInit() {
    
    // prep list of asset to swap/burn ATA
    this.assetsListCanSwap = this._avaliableToSwap()
    // set all assets by default
    this.selectedAssets = this.assetsListCanSwap;
    // calc how much SOL you will recevie 
    this.calcTotalConvert();
  }
  private _jupiter: Jupiter;
  private async _initJup() {
    const connection = this._solanaUtilsService.connection;
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
  private _avaliableToSwap() {
    //  filter tokens for merge conditions(maximum 2% of wallet portfolio)
    const filterTokens = this.assets.filter(token => {
      if (token.baseOfPortfolio < 2) {
        return token
      }
    })
    return filterTokens;
  }
  public storeSelection(selectedAsset: { asset: Asset, assetCheckbox }) {
    if (selectedAsset.assetCheckbox.el.checked) {
      this.selectedAssets.push(selectedAsset.asset)
    } else {
      const filterAcc = this.selectedAssets.filter((asset: Asset) => asset.name != selectedAsset.asset.name)
      this.selectedAssets = filterAcc;
    }
    this.calcTotalConvert();
  }
  public toggleCheck() {
    this.checkAll = !this.checkAll;
    if (this.checkAll) {
      this.selectedAssets = this.assetsListCanSwap;
    } else {
      this.selectedAssets = []
    }
    this.calcTotalConvert();
  }
  private calcTotalConvert() {
    const totalSol = this.selectedAssets.reduce(
      (previousValue, currentValue: Asset) => {
        if (currentValue.totalSolValue > this.rentAccountSize) {
          return previousValue + currentValue.totalSolValue
        } else {
          return previousValue + this.rentAccountSize
        }
      },
      0
    );
    this.totalSOLConvert = totalSol
  }
  private async calcSwapRoute(inputToken: Asset): Promise<VersionedTransaction> {
    const inputAmountInSmallestUnits = inputToken
      ? Math.round(Number(inputToken.balance) * 10 ** inputToken.decimals)
      : 0;

    const routes = await this._jupiter.computeRoutes({
      inputMint: new PublicKey(inputToken.mintAddress),
      outputMint: new PublicKey(this.wSOL),
      amount: JSBI.BigInt(inputAmountInSmallestUnits),
      slippageBps: 1, // 1 = 1%
      forceFetch: true,
    });

    const { swapTransaction } = await this._jupiter.exchange({
      routeInfo: routes.routesInfos[0]
    });
    return swapTransaction as VersionedTransaction
    // const { setupTransaction, swapTransaction, cleanupTransaction } = transactions
    // const arrayOfTx = []
    // for (let transaction of [setupTransaction, swapTransaction, cleanupTransaction].filter(Boolean)) {
    //   if (!transaction) {
    //     continue;
    //   }
    //   arrayOfTx.push(transaction)
    // }
    // console.log(arrayOfTx.flat())
    // return arrayOfTx.flat()
    // const ins = await this.extractTxInstruction(swapTransaction as VersionedTransaction);
    // return arrayOfTx;
    // console.log('tx ins:', ins)
    // return arrayOfTx
    //  return arrayOfTx;
  }
  private async extractTxInstruction(transaction: VersionedTransaction) {
  

    const addressLookupTableAccounts = await Promise.all(
      transaction.message.addressTableLookups.map(async (lookup) => {
        return new AddressLookupTableAccount({
          key: lookup.accountKey,
          state: AddressLookupTableAccount.deserialize(
            await this._solanaUtilsService.connection
              .getAccountInfo(lookup.accountKey)
              .then((res) => res.data)

          ),
        });
      })
    );


    const transactionMessage = TransactionMessage.decompile(transaction.message, {
      addressLookupTableAccounts,
    });
    const jupiterInstruction = transactionMessage.instructions.find(
      (instruction) => {
        return instruction.programId.equals(
          new PublicKey("JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB")
        );
      }
    );
    return jupiterInstruction
  }
  public async convert(): Promise<void> {
    if(!this._jupiter){
      console.log('start jup init')
      await this._initJup()
      console.log('finish load jup')

    }
    // const verTxs: VersionedTransaction[] = []
    const swapTxs: VersionedTransaction[] =[]
    const convertInstructions:  TransactionInstruction[] = await Promise.all(
      this.selectedAssets.map(async asset => {
        if (asset.totalSolValue > this.rentAccountSize) {
          // do swap
           const swapTx = await this.calcSwapRoute(asset)
           swapTxs.push(swapTx)

        } else {
          return await this.closeATA(asset)
          //  convertInstructions.push(ins)
        }
      })
    )
    
    // console.log(instructions)
    const { lastValidBlockHeight, blockhash } = await this._solanaUtilsService.connection.getLatestBlockhash();
    // let transaction = new Transaction(txArgs).add(...convertInstructions)//.serialize();
    // let transaction2 = new Transaction(txArgs).add(swapTxs)//.serialize();
    // console.log(transaction2)
    // console.log(transaction)
    // const txArgs: TransactionBlockhashCtor = { feePayer: this.wallet.publicKey, blockhash, lastValidBlockHeight: lastValidBlockHeight }
    const messageV0 = new TransactionMessage({
      payerKey: this.wallet.publicKey,
      recentBlockhash: blockhash,
      instructions: [...convertInstructions],
    }).compileToV0Message();
    const vt2 = swapTxs
    const versionedTransaction = new VersionedTransaction(messageV0).serialize().length;
    console.log(versionedTransaction,vt2)
    // await this.wallet.signTransaction(convertTransaction);

    //  await this._txInterceptService.sendTx([...convertInstructions], this.wallet.publicKey)


  }

  async closeATA(asset: Asset): Promise<TransactionInstruction> {

    const mintAddressPK = new PublicKey(asset.mintAddress);
    const walletOwner = this.wallet.publicKey;
    const tokenAccountPubkey = await this._solanaUtilsService.findAssociatedTokenAddress(walletOwner, mintAddressPK);

    let closeAccountIns = createCloseAccountInstruction(
      tokenAccountPubkey, // token account which you want to close
      walletOwner, // destination
      walletOwner // owner of token account
    )
    const closeATA: TransactionInstruction = closeAccountIns
    return closeATA;
  }
}
