import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { OptionsPopupComponent } from './options-popup/options-popup.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {


  constructor(private _popoverController: PopoverController) { }

  ngOnInit() {}
  async showOptions(e: Event) {
    const popover = await this._popoverController.create({
      component: OptionsPopupComponent,
      event: e,
      // alignment: 'start',
      cssClass: 'settings-popup',
    });
    await popover.present();
  }
}
