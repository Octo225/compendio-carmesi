import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoreListaPageRoutingModule } from './lore-lista-routing.module';

import { LoreListaPage } from './lore-lista.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoreListaPageRoutingModule
  ],
  declarations: [LoreListaPage]
})
export class LoreListaPageModule {}
