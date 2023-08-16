import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
})
export class LogoComponent implements OnInit {
  public logoUrl = '/assets/images/avaulto-logo-white.png'
  public compactDefiLogo = '/assets/images/compact-defi-logo.svg'
  constructor(private _utilsService: UtilsService) { }

  ngOnInit() {
    this._utilsService.systemTheme$.subscribe(theme =>{
      if(theme == 'dark'){
        this.logoUrl =  '/assets/images/avaulto-logo-white.png';
        this.compactDefiLogo = '/assets/images/compact-defi-logo.svg'
      }else{
        this.logoUrl =  '/assets/images/avaulto-logo-black.png';
        this.compactDefiLogo = '/assets/images/compact-defi-logo-black.svg'
      }
    })
  }

}
