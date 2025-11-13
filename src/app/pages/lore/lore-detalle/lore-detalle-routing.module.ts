import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoreDetallePage } from './lore-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: LoreDetallePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoreDetallePageRoutingModule {}
