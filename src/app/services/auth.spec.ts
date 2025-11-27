import { TestBed } from '@angular/core/testing';
import { AuthService, FireProxy } from './auth'; // Importamos el Wrapper
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;

  const authMock = { currentUser: { uid: 'test-uid' } };
  const firestoreMock = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Auth, useValue: authMock },
        { provide: Firestore, useValue: firestoreMock }
      ]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // --- Test 1: Registro ---
  it('should register user, update profile and save to firestore', async () => {
    const mockUser = { uid: '123', email: 'test@test.com' };
    const mockCredential = { user: mockUser };

    // Espiamos las propiedades del Wrapper 'FireProxy'
    const createSpy = spyOn(FireProxy, 'createUser').and.returnValue(Promise.resolve(mockCredential as any));
    const updateSpy = spyOn(FireProxy, 'updateProfile').and.returnValue(Promise.resolve());
    const docSpy = spyOn(FireProxy, 'doc').and.returnValue({} as any);
    const setDocSpy = spyOn(FireProxy, 'setDoc').and.returnValue(Promise.resolve());

    const result = await service.register('test@test.com', '123456', 'Tester');

    expect(createSpy).toHaveBeenCalled();
    expect(updateSpy).toHaveBeenCalled();
    expect(docSpy).toHaveBeenCalled();
    expect(setDocSpy).toHaveBeenCalled();
    expect(result).toEqual(mockCredential as any);
  });

  // --- Test 2: Login ---
  it('should call signInWithEmailAndPassword', async () => {
    const signInSpy = spyOn(FireProxy, 'signIn').and.returnValue(Promise.resolve({} as any));

    await service.login('test@test.com', '123456');

    expect(signInSpy).toHaveBeenCalled();
  });

  // --- Test 3: Logout ---
  it('should call signOut', async () => {
    const signOutSpy = spyOn(FireProxy, 'signOut').and.returnValue(Promise.resolve());

    await service.logout();

    expect(signOutSpy).toHaveBeenCalled();
  });

  // --- Test 4: User$ Observable ---
  it('should return user from authState', (done) => {
    const mockUser = { uid: 'user-123' };
    spyOn(FireProxy, 'authState').and.returnValue(of(mockUser as any));

    service.user$.subscribe(user => {
      expect(user).toEqual(mockUser);
      done();
    });
  });

  // --- Test 5: isLoggedIn Observable ---
  it('should return true if user is logged in', (done) => {
    spyOn(FireProxy, 'authState').and.returnValue(of({ uid: '123' } as any));

    service.isLoggedIn.subscribe(isLogged => {
      expect(isLogged).toBeTrue();
      done();
    });
  });

  it('should return false if user is NOT logged in', (done) => {
    spyOn(FireProxy, 'authState').and.returnValue(of(null));

    service.isLoggedIn.subscribe(isLogged => {
      expect(isLogged).toBeFalse();
      done();
    });
  });
});
