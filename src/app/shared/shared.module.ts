import { IonicModule } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
// import pipes
import { FilterPipe, SafePipe, ReversePipe } from "./pipes";

// import componenets
import {
  LogoComponent
} from "./components";

// // import directives
// import {

// } from "./directives";

// font awesome
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

@NgModule({
  declarations: [
    FilterPipe,
    SafePipe,
    ReversePipe,
    ReversePipe,
    LogoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    FontAwesomeModule,
    IonicModule,
    // BrowserAnimationsModule,
  ],
  exports: [
    FontAwesomeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    FilterPipe,
    SafePipe,
    ReversePipe,
    LogoComponent
  ]
})
export class SharedModule {}
