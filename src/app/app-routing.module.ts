import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'lore-detalle/:id',
    loadChildren: () => import('./pages/lore/lore-detalle/lore-detalle.module').then( m => m.LoreDetallePageModule)
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
  {
    path: 'inicio',
    loadChildren: () => import('./pages/comunidad/inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then( m => m.TabsPageModule)
  },  {
    path: 'nosotros',
    loadChildren: () => import('./pages/nosotros/nosotros.module').then( m => m.NosotrosPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule)
  },




];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
