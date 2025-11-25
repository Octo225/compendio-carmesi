import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerfilPageRoutingModule } from './perfil-routing.module';

import { PerfilPage } from './perfil.page';
import { LoginComponent } from 'src/app/componentes/login/login.component';
import { RegistroComponent } from 'src/app/componentes/registro/registro.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerfilPageRoutingModule,
    LoginComponent,
    RegistroComponent
  ],
  declarations: [PerfilPage]
})
export class PerfilPageModule {}
