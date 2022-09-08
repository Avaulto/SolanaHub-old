import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { NavController, PopoverController } from '@ionic/angular';
import { PublicKey } from '@solana/web3.js';
import { firstValueFrom } from 'rxjs';
import { Nft } from 'src/app/models';
import { NftStoreService, TxInterceptService } from 'src/app/services';
import { NftListingComponent } from './nft-listing/nft-listing.component';
import { NftSendComponent } from './nft-send/nft-send.component';


@Component({
  selector: 'app-nft-preview',
  templateUrl: './nft-preview.component.html',
  styleUrls: ['./nft-preview.component.scss'],
})
export class NftPreviewComponent implements OnInit {
  @Input() nft:Nft;
  public walletOwner: PublicKey;
  public mintAddressPK:PublicKey;
  public isListed: boolean;
  constructor(

    private _walletStore: WalletStore, 
    private _nftStoreService: NftStoreService,
    private popoverController: PopoverController,
    ) { }
  hideSkelaton: boolean = false;
  async ngOnInit() {
    this.walletOwner = await (await firstValueFrom(this._walletStore.anchorWallet$)).publicKey;

    this.mintAddressPK = new PublicKey(this.nft.mintAddress)
    this.isListed = await this._nftStoreService.listStatus(this.walletOwner.toBase58(),this.mintAddressPK.toBase58());

  }

  async presentListPopup(e: Event) {
    const popover = await this.popoverController.create({
      component: NftListingComponent,
      componentProps:{mintAddressPK: this.mintAddressPK, walletOwner: this.walletOwner},
      event:e
    });

    await popover.present();

    // const { role } = await popover.onDidDismiss();
    // this.roleMsg = `Popover dismissed with role: ${role}`;
  }
  async presentSendPopup(e: Event) {
    const popover = await this.popoverController.create({
      component: NftSendComponent,
      componentProps:{mintAddressPK: this.mintAddressPK, walletOwner: this.walletOwner},
      event:e
    });

    await popover.present();

    // const { role } = await popover.onDidDismiss();
    // this.roleMsg = `Popover dismissed with role: ${role}`;
  }
}
