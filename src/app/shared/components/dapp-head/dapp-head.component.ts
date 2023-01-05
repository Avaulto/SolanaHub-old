import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'app-dapp-head',
  templateUrl: './dapp-head.component.html',
  styleUrls: ['./dapp-head.component.scss'],
})
export class DappHeadComponent implements OnInit {
  @Input() name: string;
  @Input() imgPath: string;
  ngOnInit(): void {
    
  }
}
