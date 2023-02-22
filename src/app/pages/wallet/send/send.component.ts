import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
// import { Elusiv, TokenType } from "elusiv-sdk";
import { Asset } from 'src/app/models';
import { LoaderService, UtilsService,SolanaUtilsService, TxInterceptService } from 'src/app/services';

// @ts-ignore
// process.browser = true;

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.scss'],
})
export class SendComponent implements OnInit {
  @Input() wallet: any;
  public showValidatorList: boolean = false;
  public sendCoinForm: FormGroup;
  public formSubmitted: boolean = false;
  selectedValidator;
  searchTerm = '';
  constructor(
    public loaderService: LoaderService,
    private _fb: FormBuilder,
    private _solanaUtilsService: SolanaUtilsService,
    private _txInterceptService: TxInterceptService,
    private _utilsService: UtilsService,
    private _wallet: WalletStore
  ) { }
  ngOnInit() {
    this.sendCoinForm = this._fb.group({
      amount: ['', [Validators.required]],
      targetAddress: ['', [Validators.required]],
      privateTx: [false]
    })
  }
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
    const fixedAmount = this._utilsService.shortenNum(this.wallet.balance - 0.0001)
    this.sendCoinForm.controls.amount.setValue(fixedAmount);
  }


  async send() {
    this.formSubmitted = true;
    const { amount, targetAddress, privateTx } = this.sendCoinForm.value;

    try {
    const targetPk = new PublicKey(targetAddress);
    const walletOwnerPublicKey = new PublicKey(this.wallet.address)
    const SOL = amount * LAMPORTS_PER_SOL;
    // try {
    if (privateTx) {
      // this._sendPrivateTx(SOL, walletOwnerPublicKey, targetPk)
    } else {
      const res = await this._txInterceptService.sendSol(SOL, targetAddress, walletOwnerPublicKey)
    }
  } catch (error) {
      console.error(error)
  }
    // } catch (error) {
    //   console.warn(error)
    // }
    this.formSubmitted = false;
  }
  private async _sendPrivateTx(SOL, walletOwnerPublicKey,targetPk){
      // // maximum fee payable
      // const maxFee = 5000 * 100;

      // // generate random key
      // const randomInput = '123'// Math.random().toString(36).slice(2, 7);

      // // generate seed buffer
      // const seed = (new TextEncoder()).encode(Elusiv.hashPw(randomInput)) as Buffer;

      // // sign wallet owner
      // const signedSeed = await firstValueFrom(this._wallet.signMessage(seed));

      // // init elusiv SDK
      // const elusiv = await Elusiv.getElusivInstance(signedSeed, walletOwnerPublicKey, this._solanaUtilsService.connection);
      
      // // Top up our private balance with 1 SOL
      // const topupTxData = await elusiv.buildTopUpTx(SOL, 'LAMPORTS');

      // // Since this the topup, the funds still come from our original wallet. This is just
      // // a regular Solana transaction in this case.
      // await firstValueFrom(this._wallet.signTransaction(topupTxData.tx));

      // // send http tx Through warden
      // const topupSig = await elusiv.sendElusivTx(topupTxData)


      // // wait for confimartion for users
      // await this._solanaUtilsService.connection.confirmTransaction({
      //   signature: topupSig.sig.signature,
      //   lastValidBlockHeight: topupTxData.tx.lastValidBlockHeight!,
      //   blockhash: topupTxData.tx.recentBlockhash!
      // }, "finalized")
      
      // // tx confimed
      // await topupSig.isConfirmed

      // // // Send SOL, privately 😎
      // console.log('about to send', SOL / 2 )
      // const sendTx = await elusiv.buildSendTx(SOL / 2 , targetPk, 'LAMPORTS');
      // // send http tx Through warden
      // console.log('send pprivate ')
      // const sendTxSig = await elusiv.sendElusivTx(sendTx);
      // console.log(`Send initiated with sig ${sendTxSig.sig.signature}`);

      // // Wait for the send to be confirmed (have your UI do something else here, this takes a little)
      // await sendTxSig.isConfirmed;
      // console.log('Send complete!');
  }

}
