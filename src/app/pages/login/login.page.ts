import { Component, OnInit } from '@angular/core';
import { faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faGasPump } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public gAuthIcon = faGoogle
  public facebookAuthIcon = faFacebook
  constructor() { }

  ngOnInit() {
  }
  public icon=faGasPump;
  slideOpts = {
    initialSlide: 0,
    speed: 400
  };
}
