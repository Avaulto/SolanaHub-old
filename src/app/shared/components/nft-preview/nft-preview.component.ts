import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { NavController, PopoverController } from '@ionic/angular';
import { PublicKey } from '@solana/web3.js';
import { firstValueFrom } from 'rxjs';
import { Nft } from 'src/app/models';
import { NftStoreService, TxInterceptService } from 'src/app/services';
import { NftListingComponent } from './nft-listing/nft-listing.component';


@Component({
  selector: 'app-nft-preview',
  templateUrl: './nft-preview.component.html',
  styleUrls: ['./nft-preview.component.scss'],
})
export class NftPreviewComponent implements OnInit {
  @Input() nft:Nft;
  public walletOwner: PublicKey;
  public mintAddressPK:PublicKey;
  public listStatus: string;
  public sendNftForm: FormGroup;
  public formSubmitted: boolean = false;
  constructor(
    private fb: FormBuilder,
    private _walletStore: WalletStore, 
    private _nftStoreService: NftStoreService,
    private popoverController: PopoverController,
    private txInterceptService: TxInterceptService
    ) { }
  hideSkelaton: boolean = false;
  async ngOnInit() {
    this.sendNftForm = this.fb.group({
      targetAddress: ['', [Validators.required]],
    })
    this.walletOwner = await (await firstValueFrom(this._walletStore.anchorWallet$)).publicKey;

    this.mintAddressPK = new PublicKey(this.nft.mintAddress)
    this.listStatus = await this._nftStoreService.listStatus(this.walletOwner.toBase58(),this.mintAddressPK.toBase58());

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
  public async sendNft() {
    const targetAdress = this.sendNftForm.value.targetAddress
    const targetPublicKey = new PublicKey(targetAdress)
    this.txInterceptService.sendSplOrNft(this.mintAddressPK, this.walletOwner, targetPublicKey, 1)
  }
}
