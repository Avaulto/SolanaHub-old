import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
})
export class LogoComponent implements OnInit {
  public SolanaHubLogo = '/assets/images/logo-white.svg'
  constructor(private _utilsService: UtilsService) { }

  ngOnInit() {
    this._utilsService.systemTheme$.subscribe(theme =>{
      if(theme == 'dark'){
        this.SolanaHubLogo = '/assets/images/logo-white.svg'
      }else{
        this.SolanaHubLogo = '/assets/images/logo.svg'
      }
    })
  }

}
