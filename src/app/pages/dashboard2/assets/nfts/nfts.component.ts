import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-nfts',
  templateUrl: './nfts.component.html',
  styleUrls: ['./nfts.component.scss'],
})
export class NFTsComponent  implements OnInit {
  @Input('NFTs') NFTs = null;
  constructor() { }

  ngOnInit() {}

}
