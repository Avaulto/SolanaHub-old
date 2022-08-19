import { NgModule } from '@angular/core';
import { SideMenuPage } from './side-menu.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [SideMenuPage]
})
export class SideMenuPageModule {}
