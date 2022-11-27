import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

<<<<<<< HEAD:src/app/pages/stake-with-us/stake-with-us.module.ts
import { SupportUsPageRoutingModule } from './stake-with-us-routing.module';
=======
import { StakeWithUsPageRoutingModule } from './stake-with-us-routing.module';
>>>>>>> hotfix/0.2.1:src/app/pages/support-us/support-us.module.ts

import { StakeWithUsPage } from './stake-with-us.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
SharedModule,
StakeWithUsPageRoutingModule
  ],
  declarations: [StakeWithUsPage]
})
export class StakeWithUsPageModule {}
