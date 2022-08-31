import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { ACCOUNT_SIZE, createAssociatedTokenAccountInstruction, createTransferCheckedInstruction, getMinimumBalanceForRentExemptAccount } from  "../../../../../node_modules/@solana/spl-token";
import { Keypair, PublicKey, SystemProgram, TransactionInstruction } from '@solana/web3.js';

import { firstValueFrom } from 'rxjs';
import { SolanaUtilsService, TxInterceptService } from 'src/app/services';
import { NftStoreService } from 'src/app/services/nft-store.service';
import { Nft, NFTGroup } from '../../../models';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';


@Component({
  selector: 'app-nft-page',
  templateUrl: './nft-page.page.html',
  styleUrls: ['./nft-page.page.scss'],
})
export class NftPagePage implements OnInit {
  public NFT: Nft;
  public collectionInfo: NFTGroup
  hideSkelaton: boolean = false;
    constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _nftStoreService: NftStoreService,
    private txInterceptService:TxInterceptService,
    private _walletStore: WalletStore,
    private solanaUtilsService: SolanaUtilsService,
  ) {

  }
  public walletOwner: PublicKey;
  public mintAddressPK: PublicKey;
  public tokenAccountPubkey: PublicKey;
  async ngOnInit() {


    this.activatedRoute.params.subscribe(async (params) => {
      const mintAddress = params["mintAddress"];
      const dataSet: Nft | any = this.router.getCurrentNavigation()?.extras?.state;
      if (dataSet) {
        this.NFT = dataSet
      } else {
        this.NFT = await this._getNftData(mintAddress)
      }
      this.collectionInfo = await this.getCollectionData(this.NFT.mintAddress);
      this.walletOwner = await (await firstValueFrom(this._walletStore.anchorWallet$)).publicKey;
      console.log(this.walletOwner)
      this.mintAddressPK = new PublicKey(this.NFT.mintAddress)
      this.tokenAccountPubkey = await (await this.solanaUtilsService.findAssociatedTokenAddress(this.walletOwner,this.mintAddressPK))
 
    });
  }
  private async _getNftData(mintAddress: string): Promise<Nft> {
    const walletOwnerAddress = await (await firstValueFrom(this._walletStore.anchorWallet$)).publicKey.toBase58()
    const nftList = await this._nftStoreService.getNftList(walletOwnerAddress)
    const myNft = nftList.filter(nft => nft.mintAddress == mintAddress)[0];
    return myNft
  }
  private async getCollectionData(mintAddress: string) {
    return await this._nftStoreService.getCollectionData(mintAddress);
  }
  public async sendNft(){
    const tokenAccountPubkey = this.tokenAccountPubkey;
    const walletOwner = this.walletOwner;
    const mintAdress = this.mintAddressPK;
    const tokenAccount = Keypair.generate();
    const tokenAccountYPubkey = tokenAccount.publicKey;

    const newTokenAccount: TransactionInstruction =  SystemProgram.createAccount({
      fromPubkey: walletOwner,
      newAccountPubkey: tokenAccount.publicKey,
      space: ACCOUNT_SIZE,
      lamports: await getMinimumBalanceForRentExemptAccount(this.solanaUtilsService.connection),
      programId: TOKEN_PROGRAM_ID,
    });
    tokenAccount.publicKey
    // return await this._nftStoreService.listNft()
    const sendIns: TransactionInstruction = createTransferCheckedInstruction(
      tokenAccountPubkey, // from (should be a token account)
      mintAdress, // mint
      tokenAccountYPubkey, // to (should be a token account)
      walletOwner, // from's owner
      1e8, // amount, if your deciamls is 8, send 10^8 for 1 token
      8 // decimals
    )
    this.txInterceptService.sendTx([newTokenAccount, sendIns],walletOwner)
  }
}
