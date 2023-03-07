import { IonicModule } from "@ionic/angular";
import { CommonModule, DecimalPipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RouterModule } from "@angular/router";


// import pipes
import { FilterPipe, SafePipe, ReversePipe } from "./pipes";

// import componenets
import {
  DataBoxComponent,
  LogoComponent,
  WalletNotConnectedStateComponent,
  GoBackBtnComponent,
  WalletConnectComponent,
  WalletAdapterOptionsComponent,
  WalletConnectedDropdownComponent,
  LoaderComponent,
  SelectBoxComponent,
  SelectItemComponent,
  LabelLayoutComponent,
  NftPreviewComponent,
  TransactionReviewComponent,
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
  SettingsComponent,
  OptionsPopupComponent,
  TabsComponent,
} from "./components";

// // import directives
// import {
  
  // } from "./directives";
  


  // toop tip
import { CustomInterceptor } from "../services";
// import { TooltipModule } from "@cloudfactorydk/ng2-tooltip-directive";
import { CopyTextDirective } from "./directives/copy-text.directive";
import { TooltipModule } from "./components/tooltip/tooltip.module";
@NgModule({
  declarations: [
    FilterPipe,
    SafePipe,
    ReversePipe,
    ReversePipe,
    DataBoxComponent,
    LogoComponent,
    GoBackBtnComponent,
    WalletConnectComponent,
    WalletAdapterOptionsComponent,
    WalletConnectedDropdownComponent,
    LoaderComponent,
    SelectBoxComponent,
    SelectItemComponent,
    LabelLayoutComponent,
    NftPreviewComponent,
    TransactionReviewComponent,
    ImagePlaceholderComponent,
    NftBurnComponent,
    NftListingComponent,
    NftSendComponent,
    ChartComponent,
    WalletNotConnectedStateComponent,
    StakeComponent,
    ApyCalcComponent,
    SearchInputComponent,
    CopyTextDirective,
    DappHeadComponent,
    IconTooltipComponent,
    SettingsComponent,
    OptionsPopupComponent,
    TabsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    IonicModule,
    TooltipModule
    // TooltipModule,
    
  ],
  providers:[
    DecimalPipe,
    { provide: HTTP_INTERCEPTORS, useClass: CustomInterceptor, multi: true },
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    IonicModule,
    RouterModule,
    FilterPipe,
    SafePipe,
    ReversePipe,
    DataBoxComponent,
    LogoComponent,
    GoBackBtnComponent,
    TooltipModule,
    WalletConnectComponent,
    WalletAdapterOptionsComponent,
    WalletConnectedDropdownComponent,
    LoaderComponent,
    SelectBoxComponent,
    SelectItemComponent,
    LabelLayoutComponent,
    NftPreviewComponent,
    TransactionReviewComponent,
    ImagePlaceholderComponent,
    NftBurnComponent,
    NftListingComponent,
    NftSendComponent,
    ChartComponent,
    WalletNotConnectedStateComponent,
    StakeComponent,
    ApyCalcComponent,
    SearchInputComponent,
    CopyTextDirective,
    DappHeadComponent,
    IconTooltipComponent,
    SettingsComponent,
    OptionsPopupComponent,
    TabsComponent
    
  ]
})
export class SharedModule {}
