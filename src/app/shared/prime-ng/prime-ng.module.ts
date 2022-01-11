import { NgModule } from '@angular/core';
import { SelectButtonModule } from 'primeng/selectbutton';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [],
  exports: [SelectButtonModule, MessagesModule, MessageModule, ToastModule],
})
export class PrimeNgModule {}
