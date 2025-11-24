import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NosotrosPage } from './nosotros.page';

const routes: Routes = [
  {
    path: '',
    component: NosotrosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NosotrosPageRoutingModule {}
