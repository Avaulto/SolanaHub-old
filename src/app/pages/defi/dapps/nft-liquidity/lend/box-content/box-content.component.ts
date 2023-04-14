import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { BN } from 'bn.js';
import { WalletExtended } from 'src/app/models';
import { UtilsService } from 'src/app/services';
import { FraktStoreService } from '../../frakt-store.service';
import { FraktNftItemWithLiquidity, FraktNftMetadata, PoolIO, UserDeposit } from '../../frakt.model';
import { io } from "socket.io-client";

@Component({
  selector: 'app-box-content',
  templateUrl: './box-content.component.html',
  styleUrls: ['./box-content.component.scss'],
})
export class BoxContentComponent implements OnInit, OnChanges, OnDestroy {
  @Input() pool: FraktNftItemWithLiquidity;
  @Input() accordionOpen: boolean;
  @Input() wallet: WalletExtended;
  public formSubmitted: boolean = false;
  public lendForm: FormGroup;
  public NftMetadata: FraktNftMetadata = null
  public menu: string[] = ['deposit', 'withdraw'];
  public currentTab: string = this.menu[0];
 
  public userDeposit: UserDeposit= null;
  constructor(
    private _fb: FormBuilder,
    private _fraktStore: FraktStoreService,
     public utilsService: UtilsService) { }
  async ngOnChanges(changes) {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (this.accordionOpen) {
      await this.getNftMetadata(this.pool.slug)
      const conn = io('wss://api.frakt.xyz',{ transports: ['websocket'] });
      conn.emit('lending-subscribe', this.wallet.publicKey.toBase58());
      conn.on('lending', (loans: PoolIO[]) => {
        this.userDeposit = loans.find(loans => loans.pubkey == this.NftMetadata.liquidityPool).userDeposit
        conn.close()
          })
    }
  }
  ngOnInit() {
    this.lendForm = this._fb.group({
      amount: ['', [Validators.required]]
    })

   }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    // this.conn.close()
  }
  tabChanged(name:string){
    this.currentTab = name
    this.lendForm.controls.amount.setValue('');
  }

   setMaxAmountSOL() {
    if(this.currentTab=='deposit'){
      this.lendForm.controls.amount.setValue(this.utilsService.shortenNum(this.wallet.balance -  0.002));

    }else{
      this.lendForm.controls.amount.setValue(this.utilsService.shortenNum(this.userDeposit.depositAmount));

    }
  }
  async getNftMetadata(collectionName: string) {
    const metadata = await (await this._fraktStore.fetchPoolMetadata(collectionName)).find(loan => loan.availableLoanTypes === "onlyPriceBased");
    metadata.price = metadata.price / LAMPORTS_PER_SOL
    // metadata[0].liquidityPool = this._utilsService.addrUtil(metadata[0].liquidityPool).addrShort
    this.NftMetadata = metadata
  }

  async deposit(){
    const {amount} = this.lendForm.value;
    const amountBN = new BN(amount * LAMPORTS_PER_SOL);
    const sig = await this._fraktStore.addLiquidity(this.wallet.publicKey,new PublicKey(this.NftMetadata.liquidityPool), amountBN);
  }

  async withdaw(){
    const {amount} = this.lendForm.value;
    const amountBN = new BN(amount * LAMPORTS_PER_SOL);
    const sig = await this._fraktStore.removeLiquidity(this.wallet.publicKey,new PublicKey(this.NftMetadata.liquidityPool), amountBN);
  }
}
