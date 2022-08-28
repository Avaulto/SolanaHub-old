import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NftStoreService } from 'src/app/services/nft-store.service';

@Component({
  selector: 'app-nft-listing',
  templateUrl: './nft-listing.component.html',
  styleUrls: ['./nft-listing.component.scss']
})
export class NftListingComponent implements OnInit {
  public listNftForm: FormGroup = {} as FormGroup;
  public formSubmitted: boolean = false;
  public showDates:boolean = false;
  public expiryPlaceholder: string = 'no expiry';
  public minimumExpiry = new Date().toISOString()
  constructor(
    private _nftStoreService: NftStoreService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.listNftForm = this.fb.group({
      price: ['', [Validators.required]],
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

  }
}
