import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RegistroComponent } from './registro.component';
import { AuthService } from 'src/app/services/auth';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

describe('RegistroComponent', () => {
  let component: RegistroComponent;
  let fixture: ComponentFixture<RegistroComponent>;

  // Spies for Services
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let loadingCtrlSpy: jasmine.SpyObj<LoadingController>;
  let toastCtrlSpy: jasmine.SpyObj<ToastController>;

  // Spies for HTML Elements returned by Ionic
  let loadingElementSpy: jasmine.SpyObj<HTMLIonLoadingElement>;
  let toastElementSpy: jasmine.SpyObj<HTMLIonToastElement>;

  beforeEach(waitForAsync(() => {
    // 1. Setup Spies
    authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);

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
        RegistroComponent // Standalone component import
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: LoadingController, useValue: loadingCtrlSpy },
        { provide: ToastController, useValue: toastCtrlSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // --- Test 1: Invalid Form ---
  it('should stop execution if form is invalid', async () => {
    // Leave form empty (invalid)
    component.registroForm.reset();

    await component.onRegister();

    // Verify services were NOT called
    expect(loadingCtrlSpy.create).not.toHaveBeenCalled();
    expect(authServiceSpy.register).not.toHaveBeenCalled();
  });

  // --- Test 2: Successful Registration ---
  it('should register successfully, dismiss loading, and show welcome toast', async () => {
    // 1. Fill Form with Valid Data
    const mockUser = {
      username: 'TestUser',
      email: 'test@example.com',
      password: 'password123'
    };
    
    component.registroForm.setValue(mockUser);

    // 2. Mock Success (Return {} as any to satisfy Typescript)
    authServiceSpy.register.and.returnValue(Promise.resolve({} as any));

    // 3. Execute
    await component.onRegister();

    // 4. Assertions
    // Loading showed up?
    expect(loadingCtrlSpy.create).toHaveBeenCalled();
    expect(loadingElementSpy.present).toHaveBeenCalled();

    // Auth called with correct params?
    expect(authServiceSpy.register).toHaveBeenCalledWith(
      mockUser.email, 
      mockUser.password, 
      mockUser.username
    );

    // Loading dismissed?
    expect(loadingElementSpy.dismiss).toHaveBeenCalled();

    // Success Toast showed up?
    expect(toastCtrlSpy.create).toHaveBeenCalledWith(jasmine.objectContaining({
      message: `¡Bienvenido, ${mockUser.username}!`,
      color: 'success'
    }));
    expect(toastElementSpy.present).toHaveBeenCalled();
  });

  // --- Test 3: Registration Error ---
  it('should handle error, dismiss loading, and show error toast', async () => {
    // 1. Fill Form
    component.registroForm.setValue({
      username: 'TestUser',
      email: 'fail@example.com',
      password: 'password123'
    });

    // 2. Mock Failure
    authServiceSpy.register.and.returnValue(Promise.reject('Email already in use'));

    // Optional: Spy on console.error to keep test output clean
    spyOn(console, 'error'); 

    // 3. Execute
    await component.onRegister();

    // 4. Assertions
    expect(authServiceSpy.register).toHaveBeenCalled();
    expect(loadingElementSpy.dismiss).toHaveBeenCalled(); // Should still dismiss loading

    // Error Toast showed up?
    expect(toastCtrlSpy.create).toHaveBeenCalledWith(jasmine.objectContaining({
      message: 'Error al registrar. Intenta nuevamente.',
      color: 'danger'
    }));
    expect(toastElementSpy.present).toHaveBeenCalled();
  });
});