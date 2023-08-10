import { CommonModule, NgFor, NgIf } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, Input, OnInit } from '@angular/core';
import { IonicModule, PopoverController } from '@ionic/angular';
import { IonicSlides } from '@ionic/angular';
@Component({
  standalone: true,
  imports:[NgFor,NgIf, IonicModule],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-defi-tour',
  templateUrl: './defi-tour.component.html',
  styleUrls: ['./defi-tour.component.scss'],
})
export class DefiTourComponent implements OnInit {
  swiperModules = [IonicSlides];
  @Input() defiTour;

  constructor(private _popoverController: PopoverController) { }

  ngOnInit() {
   }
  public closePopup(): void {
    this._popoverController.dismiss()
  }
}
