import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { WalletStore } from '@heavy-duty/wallet-adapter';

import { Cluster, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { firstValueFrom, shareReplay, switchMap } from 'rxjs';
// import { Elusiv, SEED_MESSAGE } from "@elusiv/sdk";

import { LoaderService, UtilsService, SolanaUtilsService, TxInterceptService, ToasterService } from 'src/app/services';
import { environment } from 'src/environments/environment';

import { Asset, toastData } from 'src/app/models';
import va from '@vercel/analytics';
// @ts-ignore
process.browser = true;

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.scss'],
})
export class SendComponent implements OnInit {
  // private _elusiv: Elusiv;
  @Input() coin: Asset;
  public privateBalance: number = 0 // private balance in SOL
  public sendCoinForm: FormGroup;
  public formSubmitted: boolean = false;


  constructor(
    public loaderService: LoaderService,
    private _fb: FormBuilder,
    private _solanaUtilsService: SolanaUtilsService,
    private _txInterceptService: TxInterceptService,
    private _utilsService: UtilsService,
    private _wallet: WalletStore,
    private _toasterService: ToasterService,
  ) { }
  ngOnInit() {
    this.sendCoinForm = this._fb.group({
      mintAddress: [this.coin.address, Validators.required],
      amount: ['', [Validators.required]],
      targetAddress: ['', [Validators.required]],
      privateTx: [false]
    })
  }
  formatNumber = n => {
    return this._utilsService.formatBigNumbers(n);
  };

  async pkVerifyValidator() {


    return (control: AbstractControl): ValidationErrors | null => {

      const value = control.value;
      const pk = new PublicKey(value)
      const isValid = PublicKey.isOnCurve(pk.toBytes());
      if (!isValid) {
        return null;
      }
      return
    }
  }
  setMaxAmount() {
    const fixedAmount = this._utilsService.shortenNum(this.coin.balance)
    this.sendCoinForm.controls.amount.setValue(fixedAmount);
  }


  async send() {
    this.formSubmitted = true;
    const { symbol, address } = this.coin
    const { amount, targetAddress, privateTx } = this.sendCoinForm.value;
    const targetPk = new PublicKey(targetAddress);
    try {
      if (symbol !== 'SOL') {
        const mintAddress = new PublicKey(address)
        await this._txInterceptService.sendSplOrNft(
          mintAddress,
          this._solanaUtilsService.getCurrentWallet().publicKey,
          targetAddress,
          amount
        )

      } else {

        const SOL = amount * LAMPORTS_PER_SOL;
        // try {
        if (privateTx) {
          // await this._sendPrivateTx(SOL, targetPk)

        } else {
          await this._txInterceptService.sendSol(SOL, targetPk, this._solanaUtilsService.getCurrentWallet().publicKey)
        }
      }
      va.track('send asset', {privateTx});
    } catch (error) {
      console.error(error)
    }
    this.formSubmitted = false;
  }
  // private async _sendPrivateTx(SOL: number, targetPk: PublicKey) {
  //   let toasterMessage: toastData = {
  //     message: 'Building topup',
  //     segmentClass: "toastInfo",
  //     duration: 10000
  //   }
  //   // maximum fee payable
  //   const maxFee = 5000 * 100;
  //   try {
  //     const privateBalanceSOL = Number(this.privateBalance * LAMPORTS_PER_SOL) || 0
  //     // Top up our private balance only if the balance size is less than what user ask to send
  //     if (SOL > privateBalanceSOL) {
  //       this._toasterService.msg.next(toasterMessage)
  //       const topupTxData = await this._elusiv.buildTopUpTx(SOL - privateBalanceSOL, 'LAMPORTS');
  //       const signedTx = await firstValueFrom(this._wallet.signTransaction(topupTxData.tx)) as Transaction;
  //       topupTxData.setSignedTx(signedTx)

  //       // SHOW ALERT
  //       toasterMessage.message = 'Topping up your private account'
  //       this._toasterService.msg.next(toasterMessage)
  //       const topupSig = await this._elusiv.sendElusivTx(topupTxData)
  //       // update balance on UI
  //       this._getPrivateBalance()
  //     }
  //     // send http tx Through warden
  //     toasterMessage.message = 'Sending your SOL privately...'
  //     toasterMessage.duration = 500000 // 50sec
  //     this._toasterService.msg.next(toasterMessage)

  //     // Since this the topup, the funds still come from our original wallet. This is just
  //     // Send SOL, privately 😎
  //     const sendTx = await this._elusiv.buildSendTx(SOL - maxFee, targetPk, 'LAMPORTS');
  //     await this._elusiv.sendElusivTx(sendTx);
  //     // close previous toast
  //     this._toasterService.closeToast()
  //     // update balance on UI
  //     this._getPrivateBalance()
  //     // show message notification
  //     toasterMessage.message = 'Transaction Completed';
  //     toasterMessage.duration = 3000
  //     this._toasterService.msg.next(toasterMessage)

  //     // console.log(`Performed topup with sig ${topupSig.signature} and send with sig ${sendSig.signature}`);
  //     // Wait for the send to be confirmed (have your UI do something else here, this takes a little)
  //     // await sendTxSig.confirmationStatus;
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  // public async _initElusivSDK(ev) {

  //   try {
  //     if (!this._elusiv && ev.detail.checked) {
  //       // generate seed buffer
  //       const seed = (new TextEncoder()).encode(SEED_MESSAGE) as Buffer;
  //       const walletOwner = this._solanaUtilsService.getCurrentWallet().publicKey
  //       // sign wallet owner
  //       const signedSeed = await firstValueFrom(this._wallet.signMessage(seed));
  //       // init elusiv SDK
  //       this._elusiv = await Elusiv.getElusivInstance(signedSeed, walletOwner, this._solanaUtilsService.connection, environment.solanaEnv as Cluster);
  //       // init private balance
  //       setTimeout(() => {
  //         this._getPrivateBalance()
  //       }, 1500);
  //     }
  //   } catch (error) {
  //     console.error(error)
  //     this.sendCoinForm.controls.privateTx.setValue(false)
  //   }

  // }
  // private async _getPrivateBalance() {
  //   try {
  //     const balanceBN = (await this._elusiv.getLatestPrivateBalance("LAMPORTS")).toString() || 0;
  //     this.privateBalance = (Number(balanceBN) / LAMPORTS_PER_SOL).toFixedNoRounding(3);

  //   } catch (error) {
  //     console.log(error)
  //     let toasterMessage: toastData = {
  //       message: error,
  //       segmentClass: "toastError"
  //     }
  //     this._toasterService.msg.next(toasterMessage)
  //   }
  // }
}
