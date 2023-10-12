import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { AddressLookupTableAccount, TransactionBlockhashCtor } from '@solana/web3.js';
import { LAMPORTS_PER_SOL, PublicKey, Transaction, TransactionInstruction, TransactionMessage, VersionedTransaction } from '@solana/web3.js';

import { Asset } from 'src/app/models';
import { JupiterStoreService, SolanaUtilsService, TxInterceptService, UtilsService } from 'src/app/services';
import {
  createBurnInstruction,
  createCloseAccountInstruction,
} from "node_modules/@solana/spl-token";
import va from '@vercel/analytics';

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

  // @Input() wallet
  public rentAccountSize = 2039280 / LAMPORTS_PER_SOL;

  public assetsListCanSwap: Asset[] = []
  public selectedAssets: Asset[] = [];
  public totalSOLConvert = 0;
  constructor(
    private _txInterceptService: TxInterceptService,
    private _popoverController: PopoverController,
    private _solanaUtilsService: SolanaUtilsService,
    private _jupStore: JupiterStoreService
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
      if (token.baseOfPortfolio < 2 && token.symbol != 'SOL') {
        return token
      }
    })
    return filterTokens;
  }
  public storeSelection(selectedAsset: { asset: Asset, assetCheckbox }) {
    if (selectedAsset.assetCheckbox) {
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

  public async convert(): Promise<void> {

    // create array of TXS
    const swapTxs: (Transaction | TransactionInstruction)[] = []
    const closeAtaIns: TransactionInstruction[] = [];
    // calc & store tx
    await Promise.all(
      this.selectedAssets.map(async inputToken => {
        if (inputToken.totalSolValue > this.rentAccountSize) {
          // calc best route on jupiter
          const bestRoute = await this._jupStore.computeBestRoute(inputToken.balance, inputToken, this.wSOL, 1);
          // built transaction instance
          await this._jupStore.swapTx(bestRoute);
          // append to array of VersionedTransactions
          // swapTxs.push(...transactions)
        } else {
          const instruction: TransactionInstruction[] = await this.closeATA(inputToken)
          closeAtaIns.push(...instruction)
        }
      })
    )

    let closeATAMass: Array<Transaction[] | TransactionInstruction[]> = this._splitTxToChunks(closeAtaIns)

    this._popoverController.dismiss()
    if (swapTxs.length) {
      await swapTxs.reduce(async (promise, tx) => {
        // This line will wait for the last async function to finish.
        // The first iteration uses an already resolved Promise
        // so, it will immediately continue.
        await promise;
        await this._txInterceptService.sendTx([tx], this._solanaUtilsService.getCurrentWallet().publicKey)
      }, Promise.resolve());
    }

    if (closeATAMass.length) {
      await closeATAMass.reduce(async (promise, tx) => {
        // This line will wait for the last async function to finish.
        // The first iteration uses an already resolved Promise
        // so, it will immediately continue.
        await promise;
        await this._txInterceptService.sendTx(tx, this._solanaUtilsService.getCurrentWallet().publicKey)
      }, Promise.resolve());
    }
    va.track('bulk swap');
  }

  async closeATA(asset: Asset): Promise<TransactionInstruction[]> {

    const mintAddressPK = new PublicKey(asset.address);
    const walletOwner = this._solanaUtilsService.getCurrentWallet().publicKey;
    const tokenAccountPubkey = await this._solanaUtilsService.findAssociatedTokenAddress(walletOwner, mintAddressPK);
    const inputAmountInSmallestUnits = asset
    ? Math.round(Number(asset.balance) * 10 ** asset.decimals)
    : 0;
    let burnInstructions = createBurnInstruction(
      tokenAccountPubkey, // token account
      mintAddressPK, // mint
      walletOwner, // owner of token account
      inputAmountInSmallestUnits, // amount, if your deciamls is 8, 10^8 for 1 token
    )

    let closeAccountIns = createCloseAccountInstruction(
      tokenAccountPubkey, // token account which you want to close
      walletOwner, // destination
      walletOwner // owner of token account
    )
    const closeATA: TransactionInstruction[] = [burnInstructions, closeAccountIns]
    return closeATA;
  }
  private _splitTxToChunks(txs: Transaction[] | TransactionInstruction[]): Array<Transaction[] | TransactionInstruction[]> {
    const capArrayIns: Array<Transaction[] | TransactionInstruction[]> = []
    const chunkSize = 25;
    for (let i = 0; i < txs.length; i += chunkSize) {
      const chunk = txs.slice(i, i + chunkSize);
      capArrayIns.push(chunk);
      // do whatever
    }
    return capArrayIns
  }
}
