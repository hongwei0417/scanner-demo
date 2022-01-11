import { ScannerGuard } from './guards/scanner.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ScannerComponent } from './pages/scanner/scanner.component';

const routes: Routes = [
  { path: 'scanner', component: ScannerComponent, canActivate: [ScannerGuard] },
  { path: '', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
