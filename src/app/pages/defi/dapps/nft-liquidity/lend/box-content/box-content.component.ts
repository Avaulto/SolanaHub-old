import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { BN } from 'bn.js';
import { UtilsService } from 'src/app/services';
import { FraktStoreService } from '../../frakt-store.service';
import { FraktNftMetadata } from '../../frakt.model';

@Component({
  selector: 'app-box-content',
  templateUrl: './box-content.component.html',
  styleUrls: ['./box-content.component.scss'],
})
export class BoxContentComponent implements OnInit, OnChanges {
  @Input() collectionName: string;
  @Input() accordionOpen: boolean;
  @Input() activeLoans: number;
  @Input() solBalance: number = 0;
  @Input() wallet;
  public formSubmitted: boolean = false;
  public lendForm: FormGroup;
  public NftMetadata: FraktNftMetadata[] = null
  public menu: string[] = ['deposit', 'withdrawl'];
  public currentTab: string = this.menu[0]
  constructor(
    private _fb: FormBuilder,
    private _fraktStore: FraktStoreService,
     public utilsService: UtilsService) { }
  ngOnChanges(changes): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (this.accordionOpen) {
      this.getNftMetadata(this.collectionName)
    }
  }

  ngOnInit() {
    this.lendForm = this._fb.group({
      amount: ['', [Validators.required]]
    })
   }
   setMaxAmountSOL() {
    this.lendForm.controls.amount.setValue(this.utilsService.shortenNum(this.solBalance -  0.001));
  }
  async getNftMetadata(collectionName: string) {
    const metadata = await this._fraktStore.fetchPoolMetadata(collectionName);
    metadata[0].price = metadata[0].price / LAMPORTS_PER_SOL
    // metadata[0].liquidityPool = this._utilsService.addrUtil(metadata[0].liquidityPool).addrShort
    this.NftMetadata = metadata
  }

  async deposit(){
    const {amount} = this.lendForm.value;
    const amountBN = new BN(amount * LAMPORTS_PER_SOL);
    const sig = await this._fraktStore.addLiquidity(this.wallet.publicKey,new PublicKey(this.NftMetadata[0].liquidityPool), amountBN);
    // console.log(sig)
  }
}
