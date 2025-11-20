import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InicioPage } from './inicio.page';

describe('InicioPage', () => {
  let component: InicioPage;
  let fixture: ComponentFixture<InicioPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InicioPage ]
    }).compileComponents();

    fixture = TestBed.createComponent(InicioPage);
    component = fixture.componentInstance;
    
    // Al hacer detectChanges, se ejecuta ngOnInit automáticamente
    // llenando los arrays ultimasGuias y foroPopular
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TEST PARA CUBRIR LÍNEAS 27-49 (Datos de ngOnInit)
  it('debería cargar los datos estáticos al iniciar', () => {
    expect(component.ultimasGuias.length).toBeGreaterThan(0);
    expect(component.foroPopular.length).toBeGreaterThan(0);
  });

  // TEST PARA CUBRIR LÍNEA 52 (abrirGuia)
  it('debería ejecutar abrirGuia sin errores', () => {
    // Tomamos una guía real del array para pasarla como argumento
    const guiaPrueba = component.ultimasGuias[0];
    
    // Llamamos a la función
    component.abrirGuia(guiaPrueba);
    
    // Como la función está vacía, solo verificamos que "llegamos vivos" aquí
    expect(true).toBeTrue();
  });

  // TEST PARA CUBRIR LÍNEA 55 (abrirPost)
  it('debería ejecutar abrirPost sin errores', () => {
    // Tomamos un post real del array
    const postPrueba = component.foroPopular[0];
    
    // Llamamos a la función
    component.abrirPost(postPrueba);
    
    expect(true).toBeTrue();
  });
});