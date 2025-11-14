import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForoPage } from './foro.page';

const routes: Routes = [
  {
    path: '',
    component: ForoPage
  },
  {path:'crear-post',
    loadComponent: () => import('../../componentes/crear-post/crear-post.component').then( m => m.CrearPostComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForoPageRoutingModule {}
