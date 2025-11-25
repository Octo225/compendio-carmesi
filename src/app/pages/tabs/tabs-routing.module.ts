import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuard } from 'src/app/guards/auth-guard';

const routes: Routes = [
  // Ruta principal de las pestañas
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'inicio',
        loadChildren: () =>
          import('../comunidad/inicio/inicio.module').then(
            (m) => m.InicioPageModule
          ),
      },
      {
        path: 'lore',
        loadChildren: () =>
          import('../lore/lore-lista/lore-lista.module').then(
            (m) => m.LoreListaPageModule
          ),
      },
      {
        path: 'foro',
        loadChildren: () =>
          import('../foro/foro.module').then((m) => m.ForoPageModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'nosotros',
        loadChildren: () =>
          import('../nosotros/nosotros.module').then(
            (m) => m.NosotrosPageModule
          ),
      },
      {
        path: 'perfil',
        loadChildren: () =>
          import('../perfil/perfil.module').then((m) => m.PerfilPageModule),
      },

      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
