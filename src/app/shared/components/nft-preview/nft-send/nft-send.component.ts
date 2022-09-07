import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PublicKey } from '@solana/web3.js';
import { TxInterceptService } from 'src/app/services';

@Component({
  selector: 'app-nft-send',
  templateUrl: './nft-send.component.html',
  styleUrls: ['./nft-send.component.scss'],
})
export class NftSendComponent implements OnInit {
  public sendNftForm: FormGroup;
  public formSubmitted: boolean = false;
  @Input() walletOwner: PublicKey;
  @Input() mintAddressPK:PublicKey;
  constructor(
    private txInterceptService: TxInterceptService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.sendNftForm = this.fb.group({
      targetAddress: ['', [Validators.required]],
    })
  }
  public async sendNft() {
    
    const targetAdress = this.sendNftForm.value.targetAddress
    // const targetPublicKey = targetAdress
    this.txInterceptService.sendSplOrNft(this.mintAddressPK, this.walletOwner, targetAdress, 1)
  }
}
