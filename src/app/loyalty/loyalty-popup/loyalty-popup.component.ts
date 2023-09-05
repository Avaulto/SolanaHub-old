import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loyalty-popup',
  templateUrl: './loyalty-popup.component.html',
  styleUrls: ['./loyalty-popup.component.scss'],
})
export class LoyaltyPopupComponent  implements OnInit {
  public prizePool:number = 25.62
  constructor() { }

  ngOnInit() {}
  
}
