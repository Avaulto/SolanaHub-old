import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { AddressLookupTableAccount, TransactionBlockhashCtor } from '@solana/web3.js';
import { LAMPORTS_PER_SOL, PublicKey, Transaction, TransactionInstruction, TransactionMessage, VersionedTransaction } from '@solana/web3.js';
import { Asset } from 'src/app/models';
import { JupiterStoreService, SolanaUtilsService, TxInterceptService, UtilsService } from 'src/app/services';
import {
  createCloseAccountInstruction,
} from "../../../../../node_modules/@solana/spl-token";
@Component({
  selector: 'app-convert-balance-popup',
  templateUrl: './convert-balance-popup.component.html',
  styleUrls: ['./convert-balance-popup.component.scss'],
})
export class ConvertBalancePopupComponent implements OnInit {
  // set all low balance asset to true
  public wSOL = { address: "So11111111111111111111111111111111111111112" };
  public checkAll: boolean = true
  @Input() assets: Asset[];
  @Input() wallet: {
    publicKey: PublicKey;
    signTransaction: (transaction: Transaction | VersionedTransaction) => Promise<Transaction>;
    signAllTransactions: (transactions: Transaction[] | VersionedTransaction[]) => Promise<Transaction[]>;
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
    private _jupStore: JupiterStoreService,
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
    // init jupiter
    await this._jupStore.initJup(this.wallet)
    // create array of TXS
    const swapTxs: VersionedTransaction[] = []
    const closeAtaIns: TransactionInstruction[] = [];

    // calc & store tx
    await Promise.all(
      this.selectedAssets.map(async inputToken => {
        if (inputToken.totalSolValue > this.rentAccountSize) {
          // calc best route on jupiter
          const bestRoute = await this._jupStore.computeBestRoute(inputToken.balance, inputToken, this.wSOL, 1);
          // built transaction instance
          const transaction: VersionedTransaction = await this._jupStore.swapTx(bestRoute);
          // append to array of VersionedTransactions
          swapTxs.push(transaction)
        } else {
          const instruction = await this.closeATA(inputToken)
          closeAtaIns.push(instruction)
        }
      })
    )

    let closeATAMass: VersionedTransaction[] 


    if (closeAtaIns.length > 0) {
      const txInsChunks: Array<TransactionInstruction[]> = this._prepCloseATAinsArrays(closeAtaIns)
      const { blockhash } = await this._solanaUtilsService.connection.getLatestBlockhash();
      closeATAMass = txInsChunks.map((txIns: TransactionInstruction[]) => {
        const messageV0 = new TransactionMessage({
          payerKey: this.wallet.publicKey,
          recentBlockhash: blockhash,
          instructions: [...txIns],
        }).compileToV0Message();
        return new VersionedTransaction(messageV0);
      });
    }
    const allSourcesTxs = [...closeATAMass, ...swapTxs]
    // this.wallet.signAllTransactions(allSourcesTxs)
    await Promise.all(closeATAMass.map(async tx =>{
      await this._txInterceptService.sendTx2(tx, this.wallet.publicKey)
    }))


  }

  async closeATA(asset: Asset): Promise<TransactionInstruction> {

    const mintAddressPK = new PublicKey(asset.address);
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
  private _prepCloseATAinsArrays(closeAtaInsArr: TransactionInstruction[]): Array<TransactionInstruction[]> {
    const capArrayIns: Array<TransactionInstruction[]> = []
    const chunkSize = 25;
    for (let i = 0; i < closeAtaInsArr.length; i += chunkSize) {
      const chunk = closeAtaInsArr.slice(i, i + chunkSize);
      capArrayIns.push(chunk);
      // do whatever
    }
    return capArrayIns
  }
}
