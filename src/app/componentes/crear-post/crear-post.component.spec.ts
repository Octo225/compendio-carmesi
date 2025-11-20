import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearPostComponent } from './crear-post.component';
import { Foro } from 'src/app/services/foro';
import { LoadingController, ToastController, NavController } from '@ionic/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Necesario para formularios
import { of, throwError } from 'rxjs';

describe('CrearPostComponent', () => {
  let component: CrearPostComponent;
  let fixture: ComponentFixture<CrearPostComponent>;

  // Espías para los servicios externos
  let foroSpy: jasmine.SpyObj<Foro>;
  let loadingCtrlSpy: jasmine.SpyObj<LoadingController>;
  let toastCtrlSpy: jasmine.SpyObj<ToastController>;
  let navCtrlSpy: jasmine.SpyObj<NavController>;

  beforeEach(async () => {
    // 1. Crear los Mocks
    const spyForo = jasmine.createSpyObj('Foro', ['createPost']);
    const spyLoading = jasmine.createSpyObj('LoadingController', ['create']);
    const spyToast = jasmine.createSpyObj('ToastController', ['create']);
    const spyNav = jasmine.createSpyObj('NavController', ['back']);

    await TestBed.configureTestingModule({
      // SOLUCIÓN DEL ERROR:
      // Como es standalone, el componente va en IMPORTS, no en declarations
      imports: [ 
        CrearPostComponent, 
        BrowserAnimationsModule 
      ],
      providers: [
        { provide: Foro, useValue: spyForo },
        { provide: LoadingController, useValue: spyLoading },
        { provide: ToastController, useValue: spyToast },
        { provide: NavController, useValue: spyNav }
      ]
    }).compileComponents();

    // Inyectar los servicios para poder manipularlos en los tests
    foroSpy = TestBed.inject(Foro) as jasmine.SpyObj<Foro>;
    loadingCtrlSpy = TestBed.inject(LoadingController) as jasmine.SpyObj<LoadingController>;
    toastCtrlSpy = TestBed.inject(ToastController) as jasmine.SpyObj<ToastController>;
    navCtrlSpy = TestBed.inject(NavController) as jasmine.SpyObj<NavController>;

    fixture = TestBed.createComponent(CrearPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería ser inválido si el formulario está vacío', () => {
    component.postForm.controls['title'].setValue('');
    component.postForm.controls['content'].setValue('');
    expect(component.postForm.valid).toBeFalse();
  });

  it('debería llamar a createPost y navegar atrás si el formulario es válido', async () => {
    // A. Configuración de datos
    component.postForm.controls['title'].setValue('Título de prueba válido');
    component.postForm.controls['content'].setValue('Contenido de prueba con más de 10 caracteres');

    // B. Configurar qué devuelven los espías
    // Mock del elemento Loading HTML
    const loadingElementSpy = jasmine.createSpyObj('HTMLIonLoadingElement', ['present', 'dismiss']);
    loadingCtrlSpy.create.and.returnValue(Promise.resolve(loadingElementSpy));
    
    // Mock del Toast HTML
    const toastElementSpy = jasmine.createSpyObj('HTMLIonToastElement', ['present']);
    toastCtrlSpy.create.and.returnValue(Promise.resolve(toastElementSpy));

    // Mock del servicio de Foro (éxito)
    foroSpy.createPost.and.resolveTo(); // Simula una promesa resuelta vacía (void)

    // C. Ejecutar la función
    await component.onSubmit();

    // D. Verificaciones (Asserts)
    expect(loadingCtrlSpy.create).toHaveBeenCalled(); // Se creó el loading
    expect(loadingElementSpy.present).toHaveBeenCalled(); // Se mostró el loading
    expect(foroSpy.createPost).toHaveBeenCalled(); // Se llamó al servicio
    expect(loadingElementSpy.dismiss).toHaveBeenCalled(); // Se ocultó el loading
    expect(toastCtrlSpy.create).toHaveBeenCalled(); // Se creó el mensaje de éxito
    expect(navCtrlSpy.back).toHaveBeenCalled(); // Se navegó hacia atrás
    expect(component.postForm.value).toEqual({ title: null, content: null }); // Formulario reseteado
  });

  // ESTE TEST CUBRE LA LÍNEA 45
  it('no debería enviar el post si el formulario es inválido (Early Return)', async () => {
    // 1. Nos aseguramos que el formulario sea inválido (dejándolo vacío o poniendo valores cortos)
    component.postForm.controls['title'].setValue(''); // Inválido (required)
    component.postForm.controls['content'].setValue(''); // Inválido (required)

    // 2. Ejecutamos la función
    await component.onSubmit();

    // 3. Verificamos que NO pasó nada más allá del return
    // Si el return funciona, no debería intentar mostrar el Loading ni llamar al servicio
    expect(loadingCtrlSpy.create).not.toHaveBeenCalled();
    expect(foroSpy.createPost).not.toHaveBeenCalled();
  });

  it('debería mostrar error si el servicio falla', async () => {
    // A. Configuración
    component.postForm.controls['title'].setValue('Título válido');
    component.postForm.controls['content'].setValue('Contenido válido largo');

    // B. Mocks
    const loadingElementSpy = jasmine.createSpyObj('HTMLIonLoadingElement', ['present', 'dismiss']);
    loadingCtrlSpy.create.and.returnValue(Promise.resolve(loadingElementSpy));
    
    const toastElementSpy = jasmine.createSpyObj('HTMLIonToastElement', ['present']);
    toastCtrlSpy.create.and.returnValue(Promise.resolve(toastElementSpy));

    // Mock del servicio fallando
    foroSpy.createPost.and.rejectWith(new Error('Error de red'));

    // C. Ejecutar
    await component.onSubmit();

    // D. Verificaciones
    expect(foroSpy.createPost).toHaveBeenCalled();
    expect(loadingElementSpy.dismiss).toHaveBeenCalled(); // El loading debe cerrarse aunque falle
    expect(toastCtrlSpy.create).toHaveBeenCalledWith(jasmine.objectContaining({
      color: 'danger' // Verificamos que el toast sea rojo (error)
    }));
    expect(navCtrlSpy.back).not.toHaveBeenCalled(); // NO debe navegar atrás si falló
  });
});