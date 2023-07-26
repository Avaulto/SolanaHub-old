import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BasicTemplatePageRoutingModule } from './basic-template-routing.module';

import { BasicTemplatePage } from './basic-template.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
SharedModule,
    BasicTemplatePageRoutingModule
  ],
  declarations: [BasicTemplatePage]
})
export class BasicTemplatePageModule {}
