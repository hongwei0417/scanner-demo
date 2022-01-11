import { MessageService } from 'primeng/api';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './pages/home/home.component';
import { ScannerComponent } from './pages/scanner/scanner.component';
import { MaterialUiModule } from './shared/material-ui/material-ui.module';
import { DevicesComponent } from './components/devices/devices.component';
import { PrimeNgModule } from './shared/prime-ng/prime-ng.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ScannerComponent,
    DevicesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialUiModule,
    PrimeNgModule,
  ],
  providers: [MessageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
