import { MessageService } from 'primeng/api';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './pages/home/home.component';
import { ScannerComponent } from './components/scanner/scanner.component';
import { MaterialUiModule } from './shared/material-ui/material-ui.module';
import { DevicesComponent } from './components/devices/devices.component';
import { PrimeNgModule } from './shared/prime-ng/prime-ng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutoFocusDirective } from './utils/directives/auto-focus.directive';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ScannerComponent,
    DevicesComponent,
    AutoFocusDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialUiModule,
    PrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [MessageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
