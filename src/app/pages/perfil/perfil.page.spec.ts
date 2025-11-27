import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PerfilPage } from './perfil.page';
import { AuthService } from 'src/app/services/auth';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('PerfilPage', () => {
  let component: PerfilPage;
  let fixture: ComponentFixture<PerfilPage>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(waitForAsync(() => {
    // 1. Crear el SpyObj para los métodos
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);
    
    // CORRECCIÓN AQUÍ:
    // Usamos (authServiceSpy as any) para forzar la asignación de la propiedad user$
    // ignorando la restricción de 'read-only' de TypeScript.
    (authServiceSpy as any).user$ = of({ uid: 'test-uid', email: 'test@ejemplo.com', displayName: 'Tester' });

    TestBed.configureTestingModule({
      declarations: [ PerfilPage ],
      imports: [ IonicModule.forRoot() ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] 
    }).compileComponents();
  }));

  beforeEach(() => {
    // 2. Mock window.matchMedia
    // Esto es necesario porque ngOnInit lo llama inmediatamente
    spyOn(window, 'matchMedia').and.returnValue({
      matches: false, // Por defecto tema claro
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    } as MediaQueryList);

    fixture = TestBed.createComponent(PerfilPage);
    component = fixture.componentInstance;
    
    // Reseteamos la clase del body para asegurar un estado limpio
    document.body.classList.remove('dark');
    
    fixture.detectChanges(); // Dispara ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // --- Test 1: Lógica Toggle Theme ---
  it('should enable dark mode when toggle is checked', () => {
    // Simulamos el evento de un ion-toggle encendido
    const mockEvent = { detail: { checked: true } };
    
    component.toggleTheme(mockEvent);

    expect(component.isDarkMode).toBeTrue();
    expect(document.body.classList.contains('dark')).toBeTrue();
  });

  it('should disable dark mode when toggle is unchecked', () => {
    // Primero forzamos el modo oscuro
    document.body.classList.add('dark');
    component.isDarkMode = true;

    // Simulamos apagar el toggle
    const mockEvent = { detail: { checked: false } };
    
    component.toggleTheme(mockEvent);

    expect(component.isDarkMode).toBeFalse();
    expect(document.body.classList.contains('dark')).toBeFalse();
  });

  // --- Test 2: Lógica Logout ---
  it('should call auth service logout method', async () => {
    await component.logout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });

  // --- Test 3: Lógica Toggle Form ---
  it('should toggle mostrarRegistro boolean', () => {
    // Estado inicial es false
    expect(component.mostrarRegistro).toBeFalse();

    // Primer toggle -> True
    component.toggleForm();
    expect(component.mostrarRegistro).toBeTrue();

    // Segundo toggle -> False
    component.toggleForm();
    expect(component.mostrarRegistro).toBeFalse();
  });
});