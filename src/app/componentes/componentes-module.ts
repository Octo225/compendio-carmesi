import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import {IonicModule} from "@ionic/angular";
import { DetalleComponent } from './detalle/detalle.component';



@NgModule({
  declarations: [HeaderComponent, DetalleComponent],
  exports: [HeaderComponent, DetalleComponent],
  imports: [
    CommonModule,
    IonicModule
  ]

})
export class ComponentesModule { }
