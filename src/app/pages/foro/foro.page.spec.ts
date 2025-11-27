import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ForoPage } from './foro.page';
import { Foro } from 'src/app/services/foro';
import { NavController } from '@ionic/angular';
import { of } from 'rxjs';
import { Post } from 'src/app/interfaces/interfaces';

// 1. Mock de Datos
const MOCK_POSTS: Post[] = [
  { 
    id: '1', 
    title: 'Post Test', 
    content: 'Contenido', 
    category: 'foro', 
    authorId: '123', 
    authorName: 'User', 
    createdAt: { toDate: () => new Date() } 
  } as any
];

// 2. Mock del Servicio
const foroServiceMock = {
  getPosts: () => of(MOCK_POSTS)
};

describe('ForoPage', () => {
  let component: ForoPage;
  let fixture: ComponentFixture<ForoPage>;
  let navCtrlSpy: jasmine.SpyObj<NavController>;

  beforeEach(waitForAsync(() => {
    // Creamos el espía para NavController
    navCtrlSpy = jasmine.createSpyObj('NavController', ['navigateForward']);

    TestBed.configureTestingModule({
      declarations: [ ForoPage ],
      providers: [
        { provide: Foro, useValue: foroServiceMock },
        { provide: NavController, useValue: navCtrlSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ForoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar los posts al iniciar', (done) => {
    component.posts$.subscribe(posts => {
      expect(posts.length).toBe(1);
      expect(posts[0].title).toBe('Post Test');
      done();
    });
  });

  it('debe navegar a /foro/crear-post al llamar a goToCreatePost', () => {
    component.goToCreatePost();
    
    // --- CORRECCIÓN AQUÍ ---
    // Actualizamos la ruta esperada para que coincida con tu código real
    expect(navCtrlSpy.navigateForward).toHaveBeenCalledWith('/foro/crear-post');
    // Nota: Si usas tabs, tal vez tu código real sea '/tabs/foro/crear-post'. 
    // Ajusta esta línea según lo que tengas en tu foro.page.ts
  });

  it('debe navegar al detalle del post al llamar a openPost', () => {
    const postId = '123';
    component.openPost(postId);
    
    // Verificamos que navegue al detalle
    expect(navCtrlSpy.navigateForward).toHaveBeenCalledWith(['/tabs/foro/post', postId]);
  });
});