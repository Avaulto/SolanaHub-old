import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { ToastController } from "@ionic/angular";
import { Router } from "@angular/router";
import { toastData } from "../models";

@Injectable({
  providedIn: "root",
})
export class toastMessageService {
  // Result message for HTTP request - will triggerd in the message-box component
  public msg: Subject<toastData> = new Subject<toastData>();
  constructor(
    private toastController: ToastController,
    private router: Router
  ) {
    this.msg.subscribe((toastData: toastData) => {
      // show toast if not on home page

        this.presentToast(toastData.message, toastData.segmentClass);
      
    });
  }
  async presentToast(text: string, segmentClass: string) {

  }
  async presentToastWithOptions(text: string, segmentClass: string, cb?) {

  }
}
