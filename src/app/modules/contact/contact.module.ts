import { NgModule } from '@angular/core';

import { ContactComponent } from './contact.component';
import { CommonModule } from '@angular/common';
import { ContactRoutingModule } from './contact-routing.module';


@NgModule({
  declarations: [
    ContactComponent,
  ],
  imports: [
    CommonModule,
    ContactRoutingModule
  ],
})
export class ContactModule {
}
