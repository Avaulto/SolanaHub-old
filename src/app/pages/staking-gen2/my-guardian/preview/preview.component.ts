import { Component, OnInit } from '@angular/core';

interface NftAttr{
  weapon: string,
  armor: string,
  gloves: string,
  helmet: string,
  tier: string,
  'stake account': string,

}
@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
})
export class PreviewComponent  implements OnInit {
  public nftAttr: NftAttr = {
    
    weapon:'heavy sword',
    armor:'matte purple armor',
    gloves:'light gloves',
    helmet: 'Ionia focus',
    tier:'legendary',
    'stake account':'sASW....5SD2'
  }
  public demoNft = 'assets/images/nft-bg/demo-ag.png'
  constructor() { }

  ngOnInit() {}

}
