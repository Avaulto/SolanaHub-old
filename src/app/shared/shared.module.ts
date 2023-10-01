import { IonicModule } from "@ionic/angular";
import { CommonModule, DecimalPipe } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { ScrollingModule } from '@angular/cdk/scrolling';

// import pipes
import { FilterPipe, SafePipe, ReversePipe } from "./pipes";

// import componenets
import {
  DataBoxComponent,
  SelectBoxComponent,
  SelectItemComponent,
  LabelLayoutComponent,
  NftPreviewComponent,
  ImagePlaceholderComponent,
  NftBurnComponent,
  NftListingComponent,
  NftSendComponent,
  ChartComponent,
  StakeComponent,
  ApyCalcComponent,
  SearchInputComponent,
  DappHeadComponent,
  IconTooltipComponent,
  TabsComponent,
  AssetsBalanceComponent,
  LoaderComponent,
  DefiTourComponent
} from "./components";

// // import directives
// import {
  
  // } from "./directives";
  


  // toop tip
import { CustomInterceptor } from "../services";
// import { TooltipModule } from "@cloudfactorydk/ng2-tooltip-directive";
import { CopyTextDirective } from "./directives/copy-text.directive";
import { TooltipModule } from "./layouts/tooltip/tooltip.module";
import { WalletModule } from "./wallet.module";


import { register } from 'swiper/element/bundle';
register();
@NgModule({
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    FilterPipe,
    SafePipe,
    ReversePipe,
    DataBoxComponent,
    SelectBoxComponent,
    SelectItemComponent,
    LabelLayoutComponent,
    NftPreviewComponent,
    ImagePlaceholderComponent,
    NftBurnComponent,
    NftListingComponent,
    NftSendComponent,
    ChartComponent,
    StakeComponent,
    ApyCalcComponent,
    SearchInputComponent,
    CopyTextDirective,
    DappHeadComponent,
    IconTooltipComponent,
    TabsComponent,
    AssetsBalanceComponent,
    DefiTourComponent
  ],
  imports: [
    LoaderComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    IonicModule,
    TooltipModule,
    ScrollingModule,
    WalletModule
  ],
  providers:[
    DecimalPipe,
    { provide: HTTP_INTERCEPTORS, useClass: CustomInterceptor, multi: true },
  ],
  exports: [
    LoaderComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ScrollingModule,
    IonicModule,
    RouterModule,
    FilterPipe,
    SafePipe,
    ReversePipe,
    DataBoxComponent,
    TooltipModule,
    WalletModule,
    SelectBoxComponent,
    SelectItemComponent,
    LabelLayoutComponent,
    NftPreviewComponent,
    ImagePlaceholderComponent,
    NftBurnComponent,
    NftListingComponent,
    NftSendComponent,
    ChartComponent,
    DefiTourComponent,
    StakeComponent,
    ApyCalcComponent,
    SearchInputComponent,
    CopyTextDirective,
    DappHeadComponent,
    IconTooltipComponent,
    TabsComponent,
    AssetsBalanceComponent,
  ]
})
export class SharedModule {}
