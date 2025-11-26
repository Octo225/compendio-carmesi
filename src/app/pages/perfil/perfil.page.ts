// src/app/pages/perfil/perfil.page.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth';
import { Observable } from 'rxjs';

@Component({
  standalone: false, // Manteniendo tu estructura actual
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  user$: Observable<any> = this.authSvc.user$;

  // Variable para controlar el estado del toggle
  isDarkMode: boolean = false;

  mostrarRegistro = false;

  constructor(private authSvc: AuthService) { }

  ngOnInit() {
    // 1. Verificar si el tema oscuro ya está activo (por sistema o guardado)
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    // Si el body ya tiene la clase .dark O el sistema prefiere oscuro
    this.isDarkMode = document.body.classList.contains('dark') || prefersDark.matches;
  }

  // 2. Función para alternar el tema
  toggleTheme(event: any) {
    this.isDarkMode = event.detail.checked;

    if (this.isDarkMode) {
      document.body.classList.add('dark'); // Activa "Muertos"
    } else {
      document.body.classList.remove('dark'); // Activa "Vivos"
    }
  }

  async logout() {
    await this.authSvc.logout();
  }
  toggleForm() {
    this.mostrarRegistro = !this.mostrarRegistro;
  }

}
