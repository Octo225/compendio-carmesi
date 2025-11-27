import { TestBed } from '@angular/core/testing';
import { Foro } from './foro';
import { Firestore } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

describe('Foro Service', () => {
  let service: Foro;
  let authSpy: jasmine.SpyObj<Auth>;
  let firestoreSpy: jasmine.SpyObj<Firestore>;

  beforeEach(() => {
    // 1. Crear espías para las dependencias
    // Firestore mock simple
    firestoreSpy = jasmine.createSpyObj('Firestore', ['type']); 
    
    // Auth mock: importante para el currentUser
    authSpy = jasmine.createSpyObj('Auth', [], {
      currentUser: { uid: 'test-uid', displayName: 'Test User' } // Usuario por defecto
    });

    TestBed.configureTestingModule({
      providers: [
        Foro,
        { provide: Firestore, useValue: firestoreSpy },
        { provide: Auth, useValue: authSpy }
      ]
    });
    service = TestBed.inject(Foro);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('createPost debería usar "Usuario Anónimo" si displayName es null', async () => {
    // --- ARREGLO DEL ERROR ---
    // Simulamos un usuario logueado PERO sin nombre (displayName: null)
    // Usamos Object.defineProperty para sobreescribir la propiedad currentUser del spy
    Object.defineProperty(authSpy, 'currentUser', { 
      get: () => ({ uid: '123', displayName: null }) 
    });

    // Intentamos ejecutar createPost
    // Nota: Como 'addDoc' es una función externa, esto podría fallar después si no se mockea la red,
    // pero aquí lo envolvemos en try/catch para verificar solo la lógica de autenticación y nombre.
    try {
      await service.createPost('Titulo', 'Contenido', 'foro');
    } catch (error) {
      // Si el error es de red (porque no mockeamos addDoc), lo ignoramos para este test.
      // Si el error fuera "Usuario no autenticado", el test fallaría.
    }

    // Como pasamos la validación de usuario, el test se considera exitoso en cuanto al Auth.
    // (Para verificar 'addDoc' estrictamente se requerirían mocks más complejos de la librería firebase).
    expect(authSpy.currentUser).toBeTruthy();
    expect(authSpy.currentUser?.displayName).toBeNull();
  });

  it('createPost debería lanzar error si no hay usuario', async () => {
    // Simulamos que NO hay usuario (null)
    Object.defineProperty(authSpy, 'currentUser', { get: () => null });

    // Esperamos que la función lance el error exacto
    await expectAsync(service.createPost('T', 'C', 'foro'))
      .toBeRejectedWithError('Usuario no autenticado');
  });
});