import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoreListaPage } from './lore-lista/lore-lista.page';
import { LoreDetallePage } from './lore-detalle/lore-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: LoreListaPage
  },
  {
    path: ':id',
    component: LoreDetallePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LorePageRoutingModule {}