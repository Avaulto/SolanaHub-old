import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services';

@Component({
  selector: 'app-lending',
  templateUrl: './lending.page.html',
  styleUrls: ['./lending.page.scss'],
})
export class LendingPage implements OnInit {
  protected _solLendApi = 'https://api.solend.fi'
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    const headerObj = {
      "Content-Type": "application/json",
    };
    this.apiService.get(`${this._solLendApi}/healthcheck`,null,headerObj).subscribe(res=>console.log(res));
  }

}
