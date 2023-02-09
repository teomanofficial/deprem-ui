import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { SuppliesComponent } from './supplies/supplies.component';

const routes: Route[] = [
  { path: '', component: SuppliesComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuppliesRoutingModule { }
