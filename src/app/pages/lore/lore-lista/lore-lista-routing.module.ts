import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoreListaPage } from './lore-lista.page';

const routes: Routes = [
  {
    path: '',
    component: LoreListaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoreListaPageRoutingModule {}
