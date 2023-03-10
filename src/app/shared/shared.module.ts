import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateHelpFormComponent } from './components/create-help-form/create-help-form.component';
import { FilterPanelComponent } from './components/filter-panel/filter-panel.component';
import { RequestDetailsCardComponent } from './components/request-details-card/request-details-card.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FilterCardComponent } from './components/filter-panel/filter-card/filter-card.component';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@NgModule({
    declarations: [
        CreateHelpFormComponent,
        FilterPanelComponent,
        RequestDetailsCardComponent,
        FilterCardComponent,
    ],
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatSelectModule,
    MatOptionModule
  ],
  exports: [
    CreateHelpFormComponent,
    FilterPanelComponent,
    RequestDetailsCardComponent
  ]
})
export class SharedModule { }
