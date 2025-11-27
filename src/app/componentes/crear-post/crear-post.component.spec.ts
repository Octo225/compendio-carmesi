import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CrearPostComponent } from './crear-post.component';
import { IonicModule, NavController, LoadingController, ToastController } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { Foro } from 'src/app/services/foro';

// 1. Mock del Servicio
const firestoreServiceMock = {
  // createPost devuelve una Promesa resuelta
  createPost: jasmine.createSpy('createPost').and.returnValue(Promise.resolve())
};

// 2. Mocks de Ionic
const navCtrlMock = {
  back: jasmine.createSpy('back')
};

const loadingCtrlMock = {
  create: () => Promise.resolve({
    present: () => Promise.resolve(),
    dismiss: () => Promise.resolve()
  })
};

const toastCtrlMock = {
  create: () => Promise.resolve({
    present: () => Promise.resolve()
  })
};

describe('CrearPostComponent', () => {
  let component: CrearPostComponent;
  let fixture: ComponentFixture<CrearPostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ 
        IonicModule.forRoot(), 
        ReactiveFormsModule, 
        CrearPostComponent // Importamos el componente (es standalone)
      ],
      providers: [
        { provide: Foro, useValue: firestoreServiceMock },
        { provide: NavController, useValue: navCtrlMock },
        { provide: LoadingController, useValue: loadingCtrlMock },
        { provide: ToastController, useValue: toastCtrlMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CrearPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe llamar a createPost y navegar atrás si el formulario es válido', async () => {
    // 1. Llenamos el formulario con datos válidos
    component.postForm.controls['title'].setValue('Título de Prueba');
    component.postForm.controls['content'].setValue('Contenido de prueba con más de 10 caracteres');
    
    // --- CLAVE DEL ARREGLO: Asignar también la categoría ---
    component.postForm.controls['category'].setValue('guia'); 

    // 2. Ejecutamos el envío
    await component.onSubmit();

    // 3. Verificamos que el servicio se llamó con LOS 3 ARGUMENTOS
    expect(firestoreServiceMock.createPost).toHaveBeenCalledWith(
      'Título de Prueba',
      'Contenido de prueba con más de 10 caracteres',
      'guia' // <--- Si faltaba esto, el test fallaba
    );

    // 4. Verificamos que navegó hacia atrás
    expect(navCtrlMock.back).toHaveBeenCalled();
  });

  it('NO debe llamar a createPost si el formulario es inválido', async () => {
    // Reseteamos el espía para asegurar conteo limpio
    firestoreServiceMock.createPost.calls.reset();

    // Formulario vacío (inválido)
    component.postForm.controls['title'].setValue(''); 
    
    await component.onSubmit();

    expect(firestoreServiceMock.createPost).not.toHaveBeenCalled();
  });
});