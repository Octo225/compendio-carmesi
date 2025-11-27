import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth-guard'; 
import { AuthService } from '../services/auth';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { of } from 'rxjs';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let toastCtrlSpy: jasmine.SpyObj<ToastController>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [], {
      isLoggedIn: of(true)
    });

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    toastCtrlSpy = jasmine.createSpyObj('ToastController', ['create']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ToastController, useValue: toastCtrlSpy }
      ]
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('debe permitir acceso si el usuario está logueado', (done) => {
    Object.defineProperty(authServiceSpy, 'isLoggedIn', { get: () => of(true) });

    guard.canActivate().subscribe(canActivate => {
      expect(canActivate).toBeTrue();
      done();
    });
  });

  it('debe bloquear acceso y redirigir si no está logueado', (done) => {
    // 1. Simulamos que NO está logueado
    Object.defineProperty(authServiceSpy, 'isLoggedIn', { get: () => of(false) });

    // 2. Mock del Toast (Promesa resuelta)
    const toastHTMLSpy = jasmine.createSpyObj('HTMLIonToastElement', ['present']);
    toastCtrlSpy.create.and.returnValue(Promise.resolve(toastHTMLSpy));

    // 3. Suscripción
    guard.canActivate().subscribe(canActivate => {
      expect(canActivate).toBeFalse(); // Esto ocurre rápido
      
      // --- CORRECCIÓN AQUÍ ---
      // Usamos setTimeout para esperar a que las promesas (await toast) 
      // dentro del Guard terminen de ejecutarse antes de verificar el router.
      setTimeout(() => {
        expect(toastCtrlSpy.create).toHaveBeenCalled();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/tabs/perfil']); // Ahora sí pasará
        done();
      }, 0);
    });
  });
});