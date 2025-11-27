import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CrearPostComponent } from './crear-post.component';
import { IonicModule, NavController, LoadingController, ToastController } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { Foro } from 'src/app/services/foro';

describe('CrearPostComponent', () => {
  let component: CrearPostComponent;
  let fixture: ComponentFixture<CrearPostComponent>;

  // Spies for Services and Controllers
  let foroServiceSpy: jasmine.SpyObj<Foro>;
  let navCtrlSpy: jasmine.SpyObj<NavController>;
  let loadingCtrlSpy: jasmine.SpyObj<LoadingController>;
  let toastCtrlSpy: jasmine.SpyObj<ToastController>;

  // Spies for HTML Elements returned by Ionic
  let loadingElementSpy: jasmine.SpyObj<HTMLIonLoadingElement>;
  let toastElementSpy: jasmine.SpyObj<HTMLIonToastElement>;

  beforeEach(waitForAsync(() => {
    // 1. Create robust Spies
    foroServiceSpy = jasmine.createSpyObj('Foro', ['createPost']);
    navCtrlSpy = jasmine.createSpyObj('NavController', ['back']);

    // Mock Loading Controller + Element
    loadingElementSpy = jasmine.createSpyObj('HTMLIonLoadingElement', ['present', 'dismiss']);
    loadingCtrlSpy = jasmine.createSpyObj('LoadingController', ['create']);
    loadingCtrlSpy.create.and.returnValue(Promise.resolve(loadingElementSpy));

    // Mock Toast Controller + Element
    toastElementSpy = jasmine.createSpyObj('HTMLIonToastElement', ['present']);
    toastCtrlSpy = jasmine.createSpyObj('ToastController', ['create']);
    toastCtrlSpy.create.and.returnValue(Promise.resolve(toastElementSpy));

    TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(),
        ReactiveFormsModule,
        CrearPostComponent
      ],
      providers: [
        { provide: Foro, useValue: foroServiceSpy },
        { provide: NavController, useValue: navCtrlSpy },
        { provide: LoadingController, useValue: loadingCtrlSpy },
        { provide: ToastController, useValue: toastCtrlSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CrearPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // --- Test 1: Coverage for Getter 'f' ---
  it('should return form controls via getter f', () => {
    expect(component.f).toBeDefined();
    expect(component.f['title']).toBeDefined();
  });

  // --- Test 2: Validation Logic ---
  it('should NOT call createPost if form is invalid', async () => {
    component.postForm.controls['title'].setValue(''); // Invalid

    await component.onSubmit();

    expect(loadingCtrlSpy.create).not.toHaveBeenCalled();
    expect(foroServiceSpy.createPost).not.toHaveBeenCalled();
  });

  // --- Test 3: Success Scenario ---
  it('should call service, show success toast, and navigate back on success', async () => {
    // 1. Fill Form
    component.postForm.setValue({
      title: 'Valid Title',
      content: 'Valid Content Long Enough',
      category: 'guia'
    });

    // 2. Mock Success
    foroServiceSpy.createPost.and.returnValue(Promise.resolve({} as any));

    // 3. Execute
    await component.onSubmit();

    // 4. Assertions
    expect(loadingCtrlSpy.create).toHaveBeenCalled();
    expect(loadingElementSpy.present).toHaveBeenCalled();

    expect(foroServiceSpy.createPost).toHaveBeenCalledWith('Valid Title', 'Valid Content Long Enough', 'guia');

    expect(loadingElementSpy.dismiss).toHaveBeenCalled(); // Dismiss loading
    expect(navCtrlSpy.back).toHaveBeenCalled(); // Go back

    // Check Success Toast
    expect(toastCtrlSpy.create).toHaveBeenCalledWith(jasmine.objectContaining({
      message: '¡Publicación creada con éxito!',
      color: 'success'
    }));
    expect(toastElementSpy.present).toHaveBeenCalled();
  });

  // --- Test 4: Error Scenario (Catches the red lines in catch block) ---
  it('should handle error, dismiss loading, and show error toast', async () => {
    // 1. Fill Form
    component.postForm.setValue({
      title: 'Valid Title',
      content: 'Valid Content Long Enough',
      category: 'foro'
    });

    // 2. Mock Failure (Promise.reject)
    foroServiceSpy.createPost.and.returnValue(Promise.reject('Network Error'));

    // 3. Execute
    await component.onSubmit();

    // 4. Assertions
    expect(loadingCtrlSpy.create).toHaveBeenCalled();
    expect(foroServiceSpy.createPost).toHaveBeenCalled();

    // IMPORTANT: Verify loading was dismissed in the catch block
    expect(loadingElementSpy.dismiss).toHaveBeenCalled();

    // Check Error Toast
    expect(toastCtrlSpy.create).toHaveBeenCalledWith(jasmine.objectContaining({
      message: 'Error al crear la publicación',
      color: 'danger'
    }));
    expect(toastElementSpy.present).toHaveBeenCalled();

    // Ensure we DID NOT navigate back on error
    expect(navCtrlSpy.back).not.toHaveBeenCalled();
  });
});
