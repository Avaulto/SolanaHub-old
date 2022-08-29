import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { firstValueFrom } from 'rxjs';
import { Nft } from 'src/app/models';
import { UtilsService } from 'src/app/services';
import { NftStoreService } from 'src/app/services/nft-store.service';

@Component({
  selector: 'app-nft-listing',
  templateUrl: './nft-listing.component.html',
  styleUrls: ['./nft-listing.component.scss']
})
export class NftListingComponent implements OnInit {
  @Input() nft: Nft;
  public listNftForm: FormGroup = {} as FormGroup;
  public formSubmitted: boolean = false;
  public showDates:boolean = false;
  public expiryPlaceholder: string = 'no expiry';
  public minimumExpiry = new Date().toISOString()

  constructor(
    private _walletStore: WalletStore,
    private _nftStoreService: NftStoreService,
    private utilService:UtilsService,
    private fb: FormBuilder
  ) { }

  async ngOnInit() {
    const walletOwnerAddress = await (await firstValueFrom(this._walletStore.anchorWallet$)).publicKey.toBase58()
    const auctionHouseAddress = await this._nftStoreService.getCollectionMarketplaceData(this.nft.collection)
    console.log(auctionHouseAddress)
    this.listNftForm = this.fb.group({
      sellerAddress: [walletOwnerAddress, [Validators.required]],
      tokenMint:[this.nft.mintAddress,Validators.required],
      tokenAccount:[this.nft.mintAddress,Validators.required],
      auctionHouseAddress: [this.nft.mintAddress,Validators.required],
      sol: ['', [Validators.required]],
      expiry: ['']
    })
    this.listNftForm.controls.expiry.valueChanges.subscribe(val =>{
      if(val == ''){
        this.expiryPlaceholder ='no expiry'; 
      }else{
        this.expiryPlaceholder = val.split('T')[0];
      }
      this.showDates = false;
    })
  }
  public listNft(): void{
    const listInfo = this.listNftForm.value;
    console.log(listInfo);
    this._nftStoreService.listNft(listInfo)
  }
}
