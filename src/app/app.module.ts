import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { SharedModule } from './shared/shared.module';


import { HdWalletAdapterModule } from '@heavy-duty/wallet-adapter';
import { SideMenuPage } from './shared/components/side-menu/side-menu.page';
import { TabsMenuComponent } from './tabs-menu/tabs-menu.component';
import { inject } from '@vercel/analytics';
import { environment } from 'src/environments/environment';


inject({mode: "auto"});

@NgModule({
    declarations: [
        AppComponent,
        SideMenuPage,
        TabsMenuComponent
    ],
    imports: [
        SharedModule,
        BrowserModule,
        BrowserAnimationsModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        HdWalletAdapterModule.forRoot({ autoConnect: true })
    ],
    providers: [
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor() {
     
    }
}
