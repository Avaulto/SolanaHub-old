import { Component, Input, OnInit } from '@angular/core';
import { PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import { SolanaUtilsService, TxInterceptService } from 'src/app/services';
import {

  
  createBurnInstruction,
  createCloseAccountInstruction,

} from "../../../../../../node_modules/@solana/spl-token";
@Component({
  selector: 'app-nft-burn',
  templateUrl: './nft-burn.component.html',
  styleUrls: ['./nft-burn.component.scss'],
})
export class NftBurnComponent implements OnInit {
  @Input() walletOwner: PublicKey;
  @Input() mintAddressPK: PublicKey;
  constructor(
    private solanaUtilsService: SolanaUtilsService,
    private txInterceptService: TxInterceptService) { }

  ngOnInit() { }
  async burnNft() {
    console.log(this.walletOwner,this.mintAddressPK)
    const tokenAccountPubkey = await (await this.solanaUtilsService.findAssociatedTokenAddress(this.walletOwner, this.mintAddressPK));
    const walletOwner = this.walletOwner;
    const mintAdress = this.mintAddressPK;
    // const accountBalance = await this.solanaUtilsService.getTokenAccountsBalance(walletOwner.toBase58());
    // const amount = accountBalance.filter(item => item.mintAddress == mintAdress.toBase58())[0].balance
    // console.log(this.mintAddressPK.toBase58(),c )
    let burnInstructions = createBurnInstruction(
      tokenAccountPubkey, // token account
      mintAdress, // mint
      walletOwner, // owner of token account
      1, // amount, if your deciamls is 8, 10^8 for 1 token
    )
    let closeAccountIns = createCloseAccountInstruction(
      tokenAccountPubkey, // token account which you want to close
      walletOwner, // destination
      walletOwner // owner of token account
    )
    const burnNft: TransactionInstruction[] = [burnInstructions, closeAccountIns]
    this.txInterceptService.sendTx(burnNft, this.walletOwner);
  }
}
