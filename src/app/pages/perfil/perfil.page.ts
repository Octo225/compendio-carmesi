import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth';
import { Observable } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  // Observable del usuario: null si no está logueado, objeto User si sí lo está
  user$: Observable<any> = this.authSvc.user$; 
  
  // Variable para alternar entre mostrar Login o Registro
  mostrarRegistro = false; 

  constructor(private authSvc: AuthService) { }

  ngOnInit() { }

  async logout() {
    await this.authSvc.logout();
  }

  toggleForm() {
    this.mostrarRegistro = !this.mostrarRegistro;
  }
}