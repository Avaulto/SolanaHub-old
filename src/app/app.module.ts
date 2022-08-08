import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAnalytics, getAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideFunctions, getFunctions } from '@angular/fire/functions';
import { providePerformance, getPerformance } from '@angular/fire/performance';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { SharedModule } from './shared/shared.module';
import { SETTINGS as AUTH_SETTINGS, USE_DEVICE_LANGUAGE } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';


import { HdWalletAdapterModule } from '@heavy-duty/wallet-adapter';
import { CustomInterceptor } from './services/http.interceptor';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SideMenuPage } from './shared/components/side-menu/side-menu.page';
import { WalletNotConnectedStateComponent } from './wallet-not-connected-state/wallet-not-connected-state.component';
import { NftPriceService } from './services/nft-price.service';

@NgModule({
    declarations: [AppComponent, SideMenuPage, WalletNotConnectedStateComponent],
    imports: [
        SharedModule,
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        FontAwesomeModule,
        HdWalletAdapterModule.forRoot({ autoConnect: true }),
        AngularFireModule.initializeApp(environment.firebase),
        HttpClientModule,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideAnalytics(() => getAnalytics()),
        provideAuth(() => getAuth()),
        provideDatabase(() => getDatabase()),
        provideFirestore(() => getFirestore()),
        provideFunctions(() => getFunctions()),
        providePerformance(() => getPerformance()),
        provideStorage(() => getStorage())
    ],
    providers: [
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: AUTH_SETTINGS, useValue: { appVerificationDisabledForTesting: true } },
        { provide: HTTP_INTERCEPTORS, useClass: CustomInterceptor, multi: true },
        { provide: USE_DEVICE_LANGUAGE, useValue: true },
        ScreenTrackingService, 
        UserTrackingService,
        NftPriceService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
