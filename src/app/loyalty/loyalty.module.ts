import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoyaltyComponent } from './loyalty.component';
import { LoyaltyBtnComponent } from './loyalty-btn/loyalty-btn.component';
import { LoyaltyPopupComponent } from './loyalty-popup/loyalty-popup.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [
    LoyaltyComponent,
    LoyaltyBtnComponent,
    LoyaltyPopupComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports:[
    LoyaltyComponent,
    LoyaltyBtnComponent,
    LoyaltyPopupComponent
  ]
})
export class LoyaltyModule { }
