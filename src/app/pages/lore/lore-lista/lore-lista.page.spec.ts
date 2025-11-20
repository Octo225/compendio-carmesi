import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoreListaPage } from './lore-lista.page';
import { Personajes } from 'src/app/services/personajes';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('LoreListaPage', () => {
  let component: LoreListaPage;
  let fixture: ComponentFixture<LoreListaPage>;
  
  // Definimos variables para nuestros espías
  let personajesSpy: jasmine.SpyObj<Personajes>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // 1. Crear los Mocks
    const spyPersonajes = jasmine.createSpyObj('Personajes', ['getLore']);
    const spyRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ LoreListaPage ],
      providers: [
        { provide: Personajes, useValue: spyPersonajes },
        { provide: Router, useValue: spyRouter }
      ]
    }).compileComponents();

    // Inyectar para poder controlar en los tests
    personajesSpy = TestBed.inject(Personajes) as jasmine.SpyObj<Personajes>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(LoreListaPage);
    component = fixture.componentInstance;
  });

  // SOLUCIÓN PARA LÍNEA 25: Enviamos datos para que el forEach itere
  it('debería cargar datos en entradasLore al iniciar (cubre línea 25)', () => {
    // Datos simulados (mock)
    const datosFalsos = [
      { id: '1', titulo: 'Revolución' },
      { id: '2', titulo: 'Independencia' }
    ];

    // Configuramos el espía ANTES de detectar cambios
    personajesSpy.getLore.and.returnValue(of(datosFalsos));

    // Disparamos ngOnInit
    fixture.detectChanges();

    // Verificamos que el array se llenó (significa que el forEach corrió)
    expect(component.entradasLore.length).toBe(2);
    expect(component.entradasLore[0].id).toBe('1');
  });

  // SOLUCIÓN PARA LÍNEAS 31-33: Llamamos a la función explícitamente
  it('debería navegar al detalle al ejecutar verDetalle (cubre líneas 31-33)', () => {
    // Init básico para que no falle
    personajesSpy.getLore.and.returnValue(of([])); 
    fixture.detectChanges();

    // Ejecutamos la función
    component.verDetalle('id-123');

    // Verificamos que el router se llamó con los parámetros correctos
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/lore', 'id-123']);
  });
});