import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { NavController, PopoverController } from '@ionic/angular';
import { PublicKey, Signer, Transaction } from '@solana/web3.js';
import { firstValueFrom } from 'rxjs';
import { Nft } from 'src/app/models';
import { NftStoreService, SolanaUtilsService, TxInterceptService, UtilsService } from 'src/app/services';
import { environment } from 'src/environments/environment';
import { NftListingComponent } from './nft-listing/nft-listing.component';
import { NftSendComponent } from './nft-send/nft-send.component';


@Component({
  selector: 'app-nft-preview',
  templateUrl: './nft-preview.component.html',
  styleUrls: ['./nft-preview.component.scss'],
})
export class NftPreviewComponent implements OnInit {
  public env = environment.solanaEnv
  @Input() nft: Nft;
  public walletOwner: PublicKey;
  public mintAddressPK: PublicKey;
  constructor(
    private solanaUtilsService: SolanaUtilsService,
    private _walletStore: WalletStore,
    private _nftStoreService: NftStoreService,
    private popoverController: PopoverController,
    private _txInterceptService: TxInterceptService,
    public utilsService: UtilsService
  ) { }
  hideSkelaton: boolean = false;
  async ngOnInit() {
    this.walletOwner = await (await firstValueFrom(this._walletStore.anchorWallet$)).publicKey;

    this.mintAddressPK = new PublicKey(this.nft.mintAddress)
  }

  async presentListPopup(e: Event) {
    const popover = await this.popoverController.create({
      component: NftListingComponent,
      componentProps: { mintAddressPK: this.mintAddressPK, walletOwner: this.walletOwner },
      event: e
    });

    await popover.present();

    // const { role } = await popover.onDidDismiss();
    // this.roleMsg = `Popover dismissed with role: ${role}`;
  }
  public async nftListingCancel() {
    const walletOwner = await (await firstValueFrom(this._walletStore.anchorWallet$));
    const auctionHouseAddress = 'E8cU1WiRWjanGxmn96ewBgk9vPTcL6AEZ1t6F6fkgUWe';
    const tokenAccount:any = await this.solanaUtilsService.findAssociatedTokenAddress(this.walletOwner, this.mintAddressPK);
    const sol = (await this._nftStoreService.listStatus(this.mintAddressPK.toBase58()))[0].price
    const sellerAddress = walletOwner.publicKey.toBase58()
    const tokenMint = this.mintAddressPK.toBase58()
    const expiry = '-1'
    const listInfo = {auctionHouseAddress,tokenAccount,sol,sellerAddress,tokenMint,expiry};

    // get transaction instructions buffer
    const txIns: { tx: any, txSigned: any } = await this._nftStoreService.nftSellOrCancel('sell_cancel', listInfo)
    // transform from buffer to transaction instructions object
    const txn = Transaction.from(Buffer.from(txIns.txSigned.data));

    await this._txInterceptService.sendTx([txn], walletOwner.publicKey)
    // trackEvent('list NFT')
  }
  async presentSendPopup(e: Event) {
    const popover = await this.popoverController.create({
      component: NftSendComponent,
      componentProps: { mintAddressPK: this.mintAddressPK, walletOwner: this.walletOwner },
      event: e
    });

    await popover.present();

    // const { role } = await popover.onDidDismiss();
    // this.roleMsg = `Popover dismissed with role: ${role}`;
  }
}
