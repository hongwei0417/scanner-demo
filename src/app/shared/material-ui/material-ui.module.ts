import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [],
  exports: [
    MatButtonModule,
    MatIconModule,
    MatBottomSheetModule,
    MatListModule,
  ],
})
export class MaterialUiModule {}
