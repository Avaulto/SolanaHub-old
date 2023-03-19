import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-suggested-nft',
  templateUrl: './suggested-nft.component.html',
  styleUrls: ['./suggested-nft.component.scss'],
})
export class SuggestedNftComponent  implements OnInit {
  @Input() nft
  constructor() { }

  ngOnInit() {}

}
