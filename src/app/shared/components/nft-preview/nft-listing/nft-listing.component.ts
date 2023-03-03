import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { PublicKey, Transaction } from '@solana/web3.js';
import { firstValueFrom } from 'rxjs';

import { SolanaUtilsService, TxInterceptService, UtilsService } from 'src/app/services';
import { NftStoreService } from 'src/app/services/nft-store.service';

import Plausible from 'plausible-tracker'
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
const { trackEvent } = Plausible();

@Component({
  selector: 'app-nft-listing',
  templateUrl: './nft-listing.component.html',
  styleUrls: ['./nft-listing.component.scss']
})
export class NftListingComponent implements OnInit {
  @Input() walletOwner: PublicKey;
  @Input() mintAddressPK: PublicKey;
  public calendarIcon = faCalendar;
  public listNftForm: FormGroup = {} as FormGroup;
  public formSubmitted: boolean = false;
  public showDates: boolean = false;
  public expiryPlaceholder: string = 'no expiry';
  public minimumExpiry = new Date().toISOString()

  constructor(
    private _walletStore: WalletStore,
    private _nftStoreService: NftStoreService,
    private _txInterceptService: TxInterceptService,
    private _solanaUtilsService: SolanaUtilsService,
    private _fb: FormBuilder
  ) {

    this.listNftForm = this._fb.group({
      sellerAddress: [],
      tokenMint: [],
      tokenAccount: [],
      auctionHouseAddress: [],
      sol: ['', [Validators.required]],
      expiry: ['-1']
    })
  }


  async ngOnInit() {
    this._initFormSetup();
    this.listNftForm.controls.expiry.valueChanges.subscribe(val => {
      if (val == '') {
        this.expiryPlaceholder = 'no expiry';
      } else {
        this.expiryPlaceholder = val.split('T')[0];
      }
      this.showDates = false;
    })
  }

  private async _initFormSetup(): Promise<void> {
    const auctionHouseAddress = 'E8cU1WiRWjanGxmn96ewBgk9vPTcL6AEZ1t6F6fkgUWe';
    const tokenAccountPubkey = await (await this._solanaUtilsService.findAssociatedTokenAddress(this.walletOwner, this.mintAddressPK));

    this.listNftForm.controls.sellerAddress.setValue(this.walletOwner.toBase58())
    this.listNftForm.controls.tokenMint.setValue(this.mintAddressPK.toBase58())
    this.listNftForm.controls.tokenAccount.setValue(tokenAccountPubkey)
    this.listNftForm.controls.auctionHouseAddress.setValue(auctionHouseAddress)

  }
  public async listOrUnlistNft(): Promise<void> {

    // get walletOwner
    const walletOwner = await (await firstValueFrom(this._walletStore.anchorWallet$)).publicKey;
    // assign form values
    const listInfo = this.listNftForm.value;

    // get transaction instructions buffer
    const txIns: { tx: any, txSigned: any } = await this._nftStoreService.nftSellOrCancel('sell',listInfo)
    // transform from buffer to transaction instructions object
    const txn = Transaction.from(Buffer.from(txIns.txSigned.data));
    txn.instructions[0].keys[0].isSigner= false
    txn.instructions[0].keys[1].isSigner= false
    
    // submit transaction using wallet adapter
    await this._txInterceptService.sendTx([txn], walletOwner)
    trackEvent('list NFT')
  }
  // public async cancelNftListing(): Promise<void> {
  //   const listInfo = this.listNftForm.value;
  //   const txIns: { tx: any, txSigned: any } = await this._nftStoreService.nftSellOrCancel(listInfo)
  //   const walletOwner = await (await firstValueFrom(this._walletStore.anchorWallet$)).publicKey;
  //   const txn = Transaction.from(Buffer.from(txIns.txSigned.data))
  //   this._txInterceptService.sendTx([txn], walletOwner)
  // }
}
