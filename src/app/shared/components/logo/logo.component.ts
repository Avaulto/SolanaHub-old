import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
})
export class LogoComponent implements OnInit {
  public logoUrl = '/assets/images/logo-color.svg'
  constructor(private _utilsService: UtilsService) { }

  ngOnInit() {
    if(this._utilsService._systemTheme == 'dark'){
      this.logoUrl =  '/assets/images/logo-color.svg';
    }else{
      this.logoUrl =  '/assets/images/logo-black.png';
    }
  }

}
