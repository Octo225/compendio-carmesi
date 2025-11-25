import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authSvc: AuthService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  canActivate(): Observable<boolean> {
    return this.authSvc.isLoggedIn.pipe(
      take(1), // Toma el primer valor y completa
      tap(async (isLoggedIn) => {
        if (!isLoggedIn) {
          // 1. Mostrar mensaje
          const toast = await this.toastCtrl.create({
            message: 'Debes iniciar sesión para entrar al foro.',
            duration: 2500,
            color: 'warning',
            position: 'top'
          });
          await toast.present();

          // 2. Redireccionar a la pestaña de Perfil (donde estará el login)
          this.router.navigate(['/tabs/perfil']);
        }
      }),
      map(isLoggedIn => isLoggedIn) // Retorna true si logueado, false si no
    );
  }
}