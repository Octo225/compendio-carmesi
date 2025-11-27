import { TestBed } from '@angular/core/testing';
import { Foro, FirestoreProxy } from './foro'; // Import wrapper
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { of } from 'rxjs';

describe('Foro Service', () => {
  let service: Foro;
  let authSpy: jasmine.SpyObj<Auth>;
  let firestoreSpy: jasmine.SpyObj<Firestore>;

  beforeEach(() => {
    firestoreSpy = jasmine.createSpyObj('Firestore', ['type']);
    authSpy = jasmine.createSpyObj('Auth', [], {
      currentUser: { uid: 'test-uid', displayName: 'Test User' }
    });

    TestBed.configureTestingModule({
      providers: [
        Foro,
        { provide: Firestore, useValue: firestoreSpy },
        { provide: Auth, useValue: authSpy }
      ]
    });
    service = TestBed.inject(Foro);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // --- Test 1: createPost (Success) ---
  it('createPost should call addDoc with correct data', async () => {
    const addDocSpy = spyOn(FirestoreProxy, 'addDoc').and.returnValue(Promise.resolve({} as any));
    const collectionSpy = spyOn(FirestoreProxy, 'collection').and.returnValue({} as any);
    spyOn(FirestoreProxy, 'serverTimestamp').and.returnValue('TIME' as any);

    await service.createPost('Title', 'Content', 'foro');

    expect(collectionSpy).toHaveBeenCalled();
    expect(addDocSpy).toHaveBeenCalledWith(jasmine.anything(), jasmine.objectContaining({
      title: 'Title',
      category: 'foro',
      authorId: 'test-uid'
    }));
  });

  // --- Test 2: createPost (Error) ---
  it('createPost should throw error if no user', async () => {
    Object.defineProperty(authSpy, 'currentUser', { get: () => null });

    await expectAsync(service.createPost('T', 'C', 'f'))
      .toBeRejectedWithError('Usuario no autenticado');
  });

  // --- Test 3: getPosts ---
  it('getPosts should query collection and return data', () => {
    spyOn(FirestoreProxy, 'collection').and.returnValue({} as any);
    spyOn(FirestoreProxy, 'query').and.returnValue({} as any);
    spyOn(FirestoreProxy, 'orderBy').and.returnValue({} as any);
    const collectionDataSpy = spyOn(FirestoreProxy, 'collectionData').and.returnValue(of([]));

    service.getPosts().subscribe(posts => {
      expect(posts).toEqual([]);
    });

    expect(collectionDataSpy).toHaveBeenCalled();
  });

  // --- Test 4: getPostById ---
  it('getPostById should get doc data', () => {
    const docSpy = spyOn(FirestoreProxy, 'doc').and.returnValue({} as any);
    const docDataSpy = spyOn(FirestoreProxy, 'docData').and.returnValue(of({ id: '123' }));

    service.getPostById('123').subscribe(data => {
      expect(data.id).toBe('123');
    });

    expect(docSpy).toHaveBeenCalled();
    expect(docDataSpy).toHaveBeenCalled();
  });

  // --- Test 5: getComments ---
  it('getComments should query subcollection', () => {
    const collectionSpy = spyOn(FirestoreProxy, 'collection').and.returnValue({} as any);
    const orderBySpy = spyOn(FirestoreProxy, 'orderBy');
    const querySpy = spyOn(FirestoreProxy, 'query');
    const colDataSpy = spyOn(FirestoreProxy, 'collectionData').and.returnValue(of([]));

    service.getComments('post-id').subscribe();

    expect(collectionSpy).toHaveBeenCalled();
    expect(orderBySpy).toHaveBeenCalledWith('createdAt', 'asc');
    expect(querySpy).toHaveBeenCalled();
    expect(colDataSpy).toHaveBeenCalled();
  });

  // --- Test 6: addComment (Success - Normal User) ---
  it('addComment should add document to subcollection', async () => {
    const collectionSpy = spyOn(FirestoreProxy, 'collection').and.returnValue({} as any);
    const addDocSpy = spyOn(FirestoreProxy, 'addDoc').and.returnValue(Promise.resolve({} as any));
    spyOn(FirestoreProxy, 'serverTimestamp');

    await service.addComment('post-id', 'Nice post');

    expect(collectionSpy).toHaveBeenCalled();
    expect(addDocSpy).toHaveBeenCalledWith(jasmine.anything(), jasmine.objectContaining({
      content: 'Nice post',
      authorId: 'test-uid'
    }));
  });

  // --- Test 7: addComment (Error) ---
  it('addComment should throw error if not logged in', async () => {
    Object.defineProperty(authSpy, 'currentUser', { get: () => null });

    await expectAsync(service.addComment('id', 'content'))
      .toBeRejectedWithError('Debes estar logueado');
  });

  // --- Test 8: getRecentPostsByCategory ---
  it('getRecentPostsByCategory should build complex query', () => {
    spyOn(FirestoreProxy, 'collection').and.returnValue({} as any);
    const whereSpy = spyOn(FirestoreProxy, 'where');
    const limitSpy = spyOn(FirestoreProxy, 'limit');
    const orderBySpy = spyOn(FirestoreProxy, 'orderBy');
    const querySpy = spyOn(FirestoreProxy, 'query');
    spyOn(FirestoreProxy, 'collectionData').and.returnValue(of([]));

    service.getRecentPostsByCategory('foro', 5).subscribe();

    expect(whereSpy).toHaveBeenCalledWith('category', '==', 'foro');
    expect(orderBySpy).toHaveBeenCalledWith('createdAt', 'desc');
    expect(limitSpy).toHaveBeenCalledWith(5);
    expect(querySpy).toHaveBeenCalled();
  });

  // --- Test 9: Coverage 'Anónimo' in addComment ---
  it('addComment should use "Anónimo" if user displayName is null', async () => {
    Object.defineProperty(authSpy, 'currentUser', {
      get: () => ({ uid: 'test-uid', displayName: null })
    });

    spyOn(FirestoreProxy, 'collection').and.returnValue({} as any);
    const addDocSpy = spyOn(FirestoreProxy, 'addDoc').and.returnValue(Promise.resolve({} as any));
    spyOn(FirestoreProxy, 'serverTimestamp');

    await service.addComment('post-id', 'Content');

    expect(addDocSpy).toHaveBeenCalledWith(jasmine.anything(), jasmine.objectContaining({
      authorName: 'Anónimo'
    }));
  });

  // --- Test 10: Coverage getCurrentUser ---
  it('getCurrentUser should return the auth user', () => {
    const user = service.getCurrentUser();
    expect(user).toBeDefined();
    expect(user?.uid).toBe('test-uid');
  });

  // --- NEW: Test 11 (Coverage 'Usuario' in createPost) ---
  it('createPost should use "Usuario" if user displayName is null', async () => {
    // 1. Simulate user without name
    Object.defineProperty(authSpy, 'currentUser', {
      get: () => ({ uid: 'test-uid', displayName: null })
    });

    // 2. Setup spies
    const addDocSpy = spyOn(FirestoreProxy, 'addDoc').and.returnValue(Promise.resolve({} as any));
    spyOn(FirestoreProxy, 'collection').and.returnValue({} as any);
    spyOn(FirestoreProxy, 'serverTimestamp');

    // 3. Execute
    await service.createPost('Title', 'Content', 'foro');

    // 4. Verify fallback to 'Usuario'
    expect(addDocSpy).toHaveBeenCalledWith(jasmine.anything(), jasmine.objectContaining({
      authorName: 'Usuario'
    }));
  });
});
