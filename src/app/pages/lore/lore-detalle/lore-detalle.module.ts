import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoreDetallePageRoutingModule } from './lore-detalle-routing.module';

import { LoreDetallePage } from './lore-detalle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoreDetallePageRoutingModule
  ],
  declarations: [LoreDetallePage]
})
export class LoreDetallePageModule {}
