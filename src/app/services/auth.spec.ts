import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';

describe('AuthService', () => {
  let service: AuthService;

  // 1. Mock de Auth (Firebase Authentication)
  // No necesitamos implementar toda la lógica, solo que el objeto exista
  const authMock = {
    currentUser: { uid: 'test-uid' },
    // Si tuvieras métodos que se llaman directamente desde 'this.auth', irían aquí
  };

  // 2. Mock de Firestore (Base de datos)
  // Necesario porque tu AuthService lo inyecta en el constructor
  const firestoreMock = {
    // Métodos vacíos o simulados si fuera necesario
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        // 3. Proveemos los Mocks en lugar de los servicios reales
        { provide: Auth, useValue: authMock },
        { provide: Firestore, useValue: firestoreMock }
      ]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});