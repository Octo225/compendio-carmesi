import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PostDetailPage } from './post-detail.page';
import { ActivatedRoute } from '@angular/router';
import { Foro } from 'src/app/services/foro';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('PostDetailPage', () => {
  let component: PostDetailPage;
  let fixture: ComponentFixture<PostDetailPage>;
  
  // SpyObj para rastrear llamadas
  let foroServiceSpy: jasmine.SpyObj<Foro>;

  // Mock de la Ruta
  const activatedRouteMock = {
    snapshot: {
      paramMap: {
        get: (key: string) => 'test-id-123'
      }
    }
  };

  beforeEach(waitForAsync(() => {
    // Creamos el spy con los métodos necesarios
    foroServiceSpy = jasmine.createSpyObj('Foro', ['getPostById', 'getComments', 'addComment']);

    // Configuración por defecto de los retornos
    foroServiceSpy.getPostById.and.returnValue(of({ id: '123', title: 'Test Post' }));
    foroServiceSpy.getComments.and.returnValue(of([]));
    
    // CORRECCIÓN AQUÍ: Devolvemos {} as any para simular el DocumentReference
    foroServiceSpy.addComment.and.returnValue(Promise.resolve({} as any));

    TestBed.configureTestingModule({
      declarations: [ PostDetailPage ],
      imports: [ 
        IonicModule.forRoot(), 
        FormsModule 
      ], 
      providers: [
        { provide: Foro, useValue: foroServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteMock } 
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // --- Test 1: Validación (Comentario Vacío) ---
  it('should NOT call addComment if newComment is empty', async () => {
    component.newComment = '   '; 
    
    await component.sendComment();

    expect(foroServiceSpy.addComment).not.toHaveBeenCalled();
  });

  // --- Test 2: Escenario Exitoso ---
  it('should add comment and clear input on success', async () => {
    const testComment = 'This is a great post!';
    component.newComment = testComment;

    // Aseguramos que el mock devuelva éxito (con el tipo correcto simulado)
    foroServiceSpy.addComment.and.returnValue(Promise.resolve({} as any));

    await component.sendComment();

    // Verificamos llamada con ID y Texto correctos
    expect(foroServiceSpy.addComment).toHaveBeenCalledWith('test-id-123', testComment);
    
    // Verificamos que se limpió el input
    expect(component.newComment).toBe('');
  });

  // --- Test 3: Escenario de Error ---
  it('should handle error if addComment fails', async () => {
    component.newComment = 'Failing comment';

    // Simulamos fallo (Promise.reject devuelve error, no importa el tipo)
    foroServiceSpy.addComment.and.returnValue(Promise.reject('Server Error'));

    spyOn(console, 'error');

    await component.sendComment();

    expect(foroServiceSpy.addComment).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Error al comentar', 'Server Error');
    
    // El input NO debe limpiarse si falla
    expect(component.newComment).toBe('Failing comment');
  });
});