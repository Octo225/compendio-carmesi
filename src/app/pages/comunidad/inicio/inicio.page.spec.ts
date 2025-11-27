import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { InicioPage } from './inicio.page';
import { Foro } from 'src/app/services/foro';
import { NavController } from '@ionic/angular';
import { of } from 'rxjs';
import { Post } from 'src/app/interfaces/interfaces';
import { Auth } from '@angular/fire/auth';

// 1. MOCK DE DATOS CORREGIDO
// Usamos 'as any' para evitar conflictos estrictos de tipos en la prueba
const MOCK_POSTS: Post[] = [
  { 
    id: '1', 
    title: 'Test 1', 
    content: 'Contenido 1', 
    category: 'guia', 
    authorId: '1', 
    authorName: 'User', 
    createdAt: { toDate: () => new Date() } 
  } as any, // <--- ESTO SOLUCIONA EL ERROR ROJO
  { 
    id: '2', 
    title: 'Test 2', 
    content: 'Contenido 2', 
    category: 'foro', 
    authorId: '2', 
    authorName: 'User', 
    createdAt: { toDate: () => new Date() } 
  } as any  // <--- AQUÍ TAMBIÉN
];

// 2. Mock del Servicio
const foroServiceMock = {
  getRecentPostsByCategory: (category: string, limit: number) => of(MOCK_POSTS)
};

describe('InicioPage', () => {
  let component: InicioPage;
  let fixture: ComponentFixture<InicioPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InicioPage ],
      providers: [
        { provide: Foro, useValue: foroServiceMock },
        { provide: Auth, useValue: {} }, // Mock simple de Auth para evitar errores de inyección
        { provide: NavController, useValue: { navigateForward: jasmine.createSpy('navigateForward') } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InicioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar las guías recientes', (done) => {
    component.guiasRecientes$.subscribe(guias => {
      expect(guias.length).toBeGreaterThan(0);
      expect(guias[0].title).toBe('Test 1');
      done();
    });
  });

  it('debe cargar el foro popular', (done) => {
    component.comunidadReciente$.subscribe(posts => {
      expect(posts.length).toBeGreaterThan(0);
      done();
    });
  });

  it('debe navegar al detalle del post al hacer click', (done) => {
    const navCtrl = TestBed.inject(NavController);
    
    component.guiasRecientes$.subscribe(guias => {
      const guiaPrueba = guias[0];
      
      component.openPost(guiaPrueba.id!);
      
      // 'as any' también aquí para evitar quejas sobre la sobrecarga de funciones
      expect(navCtrl.navigateForward).toHaveBeenCalledWith(['/tabs/foro/post', '1'] as any);
      
      done();
    });
  });

  it('debe navegar al foro completo', () => {
    const navCtrl = TestBed.inject(NavController);
    component.goToForo();
    expect(navCtrl.navigateForward).toHaveBeenCalledWith('/tabs/foro');
  });
});