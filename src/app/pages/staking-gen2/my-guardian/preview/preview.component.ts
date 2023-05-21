import { Component, OnInit } from '@angular/core';

interface NftAttr{
  gender: string,
  weapon: string,
  armor: string,
  gloves: string,
  helmet: string,
  tier: number,
  stake: number
}
@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
})
export class PreviewComponent  implements OnInit {
  public nftAttr: NftAttr = {
    gender: 'fembot',
    weapon:'shiny sword',
    armor:'light armor',
    gloves:'epic gloves',
    helmet: 'none',
    tier:3,
    stake:1000
  }
  constructor() { }

  ngOnInit() {}

}
