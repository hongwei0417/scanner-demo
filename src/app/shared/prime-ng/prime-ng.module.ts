import { NgModule } from '@angular/core';
import { SelectButtonModule } from 'primeng/selectbutton';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [],
  exports: [
    ButtonModule,
    SelectButtonModule,
    MessagesModule,
    MessageModule,
    ToastModule,
    InputTextModule,
    InputSwitchModule,
    DialogModule,
  ],
})
export class PrimeNgModule {}
