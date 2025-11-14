import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: 'lore-lista',
    loadChildren: () => import('./pages/lore/lore-lista/lore-lista.module').then( m => m.LoreListaPageModule)
  },
  {
    path: 'lore-detalle',
    loadChildren: () => import('./pages/lore/lore-detalle/lore-detalle.module').then( m => m.LoreDetallePageModule)
  },
  {
    path: 'lore',
    loadChildren: () => import('./pages/lore/lore.module').then( m => m.LorePageModule)
  },
  {
    path: 'foro',
    loadChildren: () => import('./pages/foro/foro.module').then( m => m.ForoPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
