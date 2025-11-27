import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  // Spies to track method calls
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let loadingCtrlSpy: jasmine.SpyObj<LoadingController>;
  let toastCtrlSpy: jasmine.SpyObj<ToastController>;
  
  // Spies for the HTML elements returned by Ionic controllers
  let loadingElementSpy: jasmine.SpyObj<HTMLIonLoadingElement>;
  let toastElementSpy: jasmine.SpyObj<HTMLIonToastElement>;

  beforeEach(waitForAsync(() => {
    // 1. Create robust mocks using Jasmine spies
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    
    // Mock the Loading Element (what .create() returns)
    loadingElementSpy = jasmine.createSpyObj('HTMLIonLoadingElement', ['present', 'dismiss']);
    loadingCtrlSpy = jasmine.createSpyObj('LoadingController', ['create']);
    loadingCtrlSpy.create.and.returnValue(Promise.resolve(loadingElementSpy));

    // Mock the Toast Element (what .create() returns)
    toastElementSpy = jasmine.createSpyObj('HTMLIonToastElement', ['present']);
    toastCtrlSpy = jasmine.createSpyObj('ToastController', ['create']);
    toastCtrlSpy.create.and.returnValue(Promise.resolve(toastElementSpy));

    TestBed.configureTestingModule({
      imports: [ 
        IonicModule.forRoot(), 
        ReactiveFormsModule, 
        LoginComponent // Imported here because it is standalone
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: LoadingController, useValue: loadingCtrlSpy },
        { provide: ToastController, useValue: toastCtrlSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // --- Test 1: Invalid Form ---
  it('should not call loading or auth if form is invalid', async () => {
    // Set form to invalid state (empty)
    component.loginForm.controls['email'].setValue('');
    component.loginForm.controls['password'].setValue('');

    await component.onLogin();

    // Verify code stopped early
    expect(loadingCtrlSpy.create).not.toHaveBeenCalled();
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  // --- Test 2: Successful Login ---
  it('should show loading, call auth, and dismiss loading on success', async () => {
    // 1. Set valid form data
    const testEmail = 'test@example.com';
    const testPass = '123456';
    component.loginForm.controls['email'].setValue(testEmail);
    component.loginForm.controls['password'].setValue(testPass);

    // 2. Mock successful login
    // Usamos {} as any para simular un UserCredential sin importar los detalles
    authServiceSpy.login.and.returnValue(Promise.resolve({} as any));

    // 3. Execute
    await component.onLogin();

    // 4. Assertions
    expect(loadingCtrlSpy.create).toHaveBeenCalled();
    expect(loadingElementSpy.present).toHaveBeenCalled();
    expect(authServiceSpy.login).toHaveBeenCalledWith(testEmail, testPass);
    expect(loadingElementSpy.dismiss).toHaveBeenCalled(); // Success path dismissal
  });

  // --- Test 3: Failed Login (Error Handling) ---
  it('should show error toast if login fails', async () => {
    // 1. Set valid form data
    component.loginForm.controls['email'].setValue('fail@example.com');
    component.loginForm.controls['password'].setValue('123456');

    // 2. Mock failed login (Promise.reject)
    authServiceSpy.login.and.returnValue(Promise.reject('Auth Error'));

    // 3. Execute
    await component.onLogin();

    // 4. Assertions
    expect(authServiceSpy.login).toHaveBeenCalled();
    expect(loadingElementSpy.dismiss).toHaveBeenCalled(); // Catch block dismissal
    
    // Check if Toast was created and presented
    expect(toastCtrlSpy.create).toHaveBeenCalledWith(jasmine.objectContaining({
      color: 'danger',
      message: 'Credenciales incorrectas'
    }));
    expect(toastElementSpy.present).toHaveBeenCalled();
  });
});