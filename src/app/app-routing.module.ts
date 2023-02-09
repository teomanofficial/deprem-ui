import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', loadChildren: () => import('./modules/home/home.module').then(x => x.HomeModule) },
  { path: 'iletisim', loadChildren: () => import('./modules/contact/contact.module').then(x => x.ContactModule) },
  { path: 'ihtiyac-malzemeleri', loadChildren: () => import('./modules/supplies/supplies.module').then(x => x.SuppliesModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
