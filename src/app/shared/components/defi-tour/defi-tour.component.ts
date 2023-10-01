
import { Component, Input } from '@angular/core';
import {  PopoverController } from '@ionic/angular';
import { IonicSlides } from '@ionic/angular';

@Component({
  selector: 'app-defi-tour',
  templateUrl: './defi-tour.component.html',
  styleUrls: ['./defi-tour.component.scss'],
})
export class DefiTourComponent{
  swiperModules = [IonicSlides];
  @Input({required:true}) defiTour;

  constructor(private _popoverController: PopoverController) { }

  public closePopup(): void {
    this._popoverController.dismiss()
  }
}
