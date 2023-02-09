import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuppliesRoutingModule } from './supplies-routing.module';
import { SuppliesComponent } from './supplies/supplies.component';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';


@NgModule({
  declarations: [
    SuppliesComponent,
  ],
  imports: [
    CommonModule,
    SuppliesRoutingModule,
    MatCardModule,
    MatTableModule
  ],
})
export class SuppliesModule { }
