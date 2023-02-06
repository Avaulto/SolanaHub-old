import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { firstValueFrom } from 'rxjs';
// import { Elusiv, TokenType } from "elusiv-sdk";
import { Asset } from 'src/app/models';
import { LoaderService, UtilsService } from 'src/app/services';
import { SolanaUtilsService } from 'src/app/services/solana-utils.service';
import { TxInterceptService } from 'src/app/services/txIntercept.service';

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.scss'],
})
export class SendComponent implements OnInit {
  @Input() wallet: Asset;
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
    const targetPk = new PublicKey(targetAddress);
    const walletOwnerPublicKey = new PublicKey(this.wallet.address)
    // try {
      if (privateTx) {
        // const randomInput = Math.random().toString(36).slice(2, 7);
        // const seed = (new TextEncoder()).encode(Elusiv.hashPw(randomInput)) as Buffer;
        // const signedSeed = await firstValueFrom(this._wallet.signMessage(seed));
        // const elusiv = await Elusiv.getElusivInstance(signedSeed, walletOwnerPublicKey, this._solanaUtilsService.connection); // this line return err
        // console.log(elusiv)
        // // Top up our private balance with 1 SOL
        // const topupTxData = await elusiv.buildTopUpTx(amount * LAMPORTS_PER_SOL, 'LAMPORTS');

        // // Since this the topup, the funds still come from our original wallet. This is just
        // // a regular Solana transaction in this case.

        // const sendPrivatlytX = await elusiv.buildSendTx(amount * LAMPORTS_PER_SOL, targetPk, 'LAMPORTS');
        // const sendRes = await elusiv.sendElusivTx(sendPrivatlytX);
        // // Send SOL, privately 😎
        // const res = await this._txInterceptService.sendTx([topupTxData.tx, ], walletOwnerPublicKey)

      } else {
        const res = await this._txInterceptService.sendSol(amount * LAMPORTS_PER_SOL, targetAddress, walletOwnerPublicKey)
      }
    // } catch (error) {
    //   console.warn(error)
    // }
    this.formSubmitted = false;
  }
}
