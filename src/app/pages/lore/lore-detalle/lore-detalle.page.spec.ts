import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoreDetallePage } from './lore-detalle.page';
import { ActivatedRoute, Router } from '@angular/router'; // Importamos Router
import { Personajes } from 'src/app/services/personajes';
import { of } from 'rxjs';

describe('LoreDetallePage', () => {
  let component: LoreDetallePage;
  let fixture: ComponentFixture<LoreDetallePage>;
  
  // Variables para los espías
  let routerSpy: jasmine.SpyObj<Router>;
  let routeStub: any; // Usaremos un objeto simple para manipular la ruta

  beforeEach(async () => {
    // 1. Mock del Router (para verificar la redirección)
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    // 2. Mock de ActivatedRoute (Configuración por defecto: ID existe)
    routeStub = {
      snapshot: {
        paramMap: {
          get: (key: string) => '123' // Por defecto devuelve un ID
        }
      }
    };

    // 3. Mock de Personajes
    const personajesSpy = jasmine.createSpyObj('Personajes', ['getLoreDetalle']);
    personajesSpy.getLoreDetalle.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      declarations: [ LoreDetallePage ],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: routeStub }, // Usamos nuestra variable routeStub
        { provide: Personajes, useValue: personajesSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoreDetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ESTE TEST PINTA DE VERDE LAS LÍNEAS 27-29
  it('debería redirigir a /lore si el ID es nulo', () => {
    // 1. Sobrescribimos el comportamiento de la ruta SOLO para este test
    routeStub.snapshot.paramMap.get = () => null; // Ahora devuelve null

    // 2. Ejecutamos ngOnInit manualmente para que vuelva a leer el ID
    component.ngOnInit();

    // 3. Verificamos que entró al IF y llamó a navegar
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/lore']);
  });
});