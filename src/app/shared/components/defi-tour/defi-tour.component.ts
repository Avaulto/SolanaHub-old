import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-defi-tour',
  templateUrl: './defi-tour.component.html',
  styleUrls: ['./defi-tour.component.scss'],
})
export class DefiTourComponent implements OnInit {
  @Input() defiTour;
  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    speed: 400
  };
  constructor(private _popoverController: PopoverController) { }

  ngOnInit() { }
  public closePopup(): void {
    this._popoverController.dismiss()
  }
}
