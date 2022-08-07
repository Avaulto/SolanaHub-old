import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { toastData } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

// Result message for HTTP request - will triggerd in the message-box component
msg: Subject<toastData> = new Subject<toastData>();
constructor(
  private toastController: ToastController,
  private router: Router
) {
  this.msg.subscribe((toastData: toastData) => this.presentToastWithOptions(toastData.message,toastData.icon, toastData.segmentClass));
}
async presentToast(text: string, segmentClass: string) {
  const toast = await this.toastController.create({
    cssClass: `toastStyle ${segmentClass}`,
    message: text,
    duration: 3000,
    animated: true,
  });
  toast.present();
}
async presentToastWithOptions(message: string,icon: string, segmentClass: string, cb?) {
  const toast = await this.toastController.create({
    cssClass: `toastStyle ${segmentClass}`,
    // color:'primary',
    duration: 5000,
    animated: true,
    message,
    buttons: [
      {
        side: "start",
        icon,
        handler: () => {
          return false
        },
      },
      {
        // text: btnText,
        cssClass: 'msg-close-icon',
        icon: "close-outline",
        role: "cancel",
        handler: () => {
          cb();
        },
      },
    ],
  });
  toast.present();
}
}
