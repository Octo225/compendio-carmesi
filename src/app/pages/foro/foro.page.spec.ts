import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForoPage } from './foro.page';
import { Foro } from 'src/app/services/foro';
import { NavController } from '@ionic/angular';
import { of } from 'rxjs';

describe('ForoPage', () => {
  let component: ForoPage;
  let fixture: ComponentFixture<ForoPage>;
  
  // Definimos las variables para los espías
  let navCtrlSpy: jasmine.SpyObj<NavController>;
  let foroSpy: jasmine.SpyObj<Foro>;

  beforeEach(async () => {
    // 1. Creamos los Mocks (Objetos falsos)
    // Necesitamos espiar 'navigateForward' del NavController
    const spyNav = jasmine.createSpyObj('NavController', ['navigateForward']);
    // Necesitamos espiar 'getPosts' del servicio Foro
    const spyForo = jasmine.createSpyObj('Foro', ['getPosts']);

    // Configuramos que getPosts devuelva un array vacío para que ngOnInit no falle
    spyForo.getPosts.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [ ForoPage ],
      providers: [
        // Inyectamos nuestros dobles de acción
        { provide: NavController, useValue: spyNav },
        { provide: Foro, useValue: spyForo }
      ]
    }).compileComponents();

    // Recuperamos los espías para poder interrogarlos en los tests
    navCtrlSpy = TestBed.inject(NavController) as jasmine.SpyObj<NavController>;
    foroSpy = TestBed.inject(Foro) as jasmine.SpyObj<Foro>;

    fixture = TestBed.createComponent(ForoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // --- SOLUCIÓN PARA LÍNEAS 29-31 (goToCreatePost) ---
  it('debería navegar a /foro/create al llamar a goToCreatePost', () => {
    // 1. Ejecutamos la función
    component.goToCreatePost();

    // 2. Verificamos que el NavController haya sido llamado con la ruta correcta
    expect(navCtrlSpy.navigateForward).toHaveBeenCalledWith('/foro/create');
  });

  // --- SOLUCIÓN PARA LÍNEAS 33-36 (openPost) ---
  it('debería hacer un console.log al llamar a openPost', () => {
    // Espiamos el console.log para verificar que se ejecute
    spyOn(console, 'log');

    // 1. Ejecutamos la función con un ID de prueba
    component.openPost('id-prueba-123');

    // 2. Verificamos que se imprimió el mensaje esperado
    expect(console.log).toHaveBeenCalledWith('Navegar al post con ID:', 'id-prueba-123');
  });
});