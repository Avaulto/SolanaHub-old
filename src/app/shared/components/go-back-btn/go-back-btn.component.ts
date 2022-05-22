import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-go-back-btn',
  templateUrl: './go-back-btn.component.html',
  styleUrls: ['./go-back-btn.component.scss'],
})
export class GoBackBtnComponent implements OnInit {

  constructor(private navCtrl:NavController) { }

  ngOnInit() {}
  back(): void {
    this.navCtrl.back({animated:true});
}
}
