import { provideHttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

  interface Elemento {
  icono: string;
  nombre: string;
  ruta: string;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  elementos: Elemento[] = [
    {
      icono: 'home-outline',
      nombre: 'Inicio',
      ruta: '/inicio',
    },
    {
      icono: 'newspaper-outline',
      nombre: 'Noticias',
      ruta: '/noticias',
    },
    {
      icono: 'people-outline',
      nombre: 'Nosotros',
      ruta: '/nosotros',
    },
    {
      icono: 'construct-outline',
      nombre: 'Componentes',
      ruta: '/componentes',
    },
    
  ];

  constructor() {}
}
