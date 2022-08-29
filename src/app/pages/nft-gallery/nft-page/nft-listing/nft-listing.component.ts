import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
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
  ) { 
    // console.log(walletOwner,auctionHouseAddress,associatedTokenAddress)
    this.listNftForm = this.fb.group({
      sellerAddress: [],
      tokenMint:[],
      tokenAccount:[],
      auctionHouseAddress: [],
      sol: ['', [Validators.required]],
      expiry: ['']
    })
  }

  async findAssociatedTokenAddress(
    walletAddress: PublicKey,
    tokenMintAddress: PublicKey
): Promise<PublicKey> {
  const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID: PublicKey = new PublicKey(
    'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
  );
    return (await PublicKey.findProgramAddress(
        [
            walletAddress.toBuffer(),
            TOKEN_PROGRAM_ID.toBuffer(),
            tokenMintAddress.toBuffer(),
        ],
        SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    ))[0];
}
  async ngOnInit() {
    
    this.initFormSetup();
    this.listNftForm.controls.expiry.valueChanges.subscribe(val =>{
      if(val == ''){
        this.expiryPlaceholder ='no expiry'; 
      }else{
        this.expiryPlaceholder = val.split('T')[0];
      }
      this.showDates = false;
    })
  }
  private async initFormSetup(){
    const walletOwner = await (await firstValueFrom(this._walletStore.anchorWallet$)).publicKey;
    const auctionHouseAddress =( await this._nftStoreService.getCollectionMarketplaceData(this.nft.collection)).auctionHouse;
    const mintAddressPK = new PublicKey(this.nft.mintAddress)
    const associatedTokenAddress = await (await this.findAssociatedTokenAddress(walletOwner,mintAddressPK))

    this.listNftForm.controls.sellerAddress.setValue(walletOwner.toBase58())
    this.listNftForm.controls.tokenMint.setValue(mintAddressPK.toBase58())
    this.listNftForm.controls.tokenAccount.setValue(associatedTokenAddress.toBase58())
    this.listNftForm.controls.auctionHouseAddress.setValue(auctionHouseAddress)

  }
  public listNft(): void{
    const listInfo = this.listNftForm.value;
    console.log(listInfo);
    this._nftStoreService.listNft(listInfo)
  }
}
