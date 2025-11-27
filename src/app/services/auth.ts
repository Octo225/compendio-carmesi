import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  authState,
  updateProfile
} from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// --- WRAPPER PARA TESTING ---
// Agrupamos las funciones sueltas en un objeto exportado.
// Esto permite que 'spyOn' funcione sobre este objeto en las pruebas.
export const FireProxy = {
  createUser: createUserWithEmailAndPassword,
  signIn: signInWithEmailAndPassword,
  signOut: signOut,
  updateProfile: updateProfile,
  authState: authState,
  doc: doc,
  setDoc: setDoc
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) { }

  // 1. Registro
  async register(email: string, pass: string, username: string) {
    // Usamos FireProxy en lugar de llamar a la función directamente
    const userCredential = await FireProxy.createUser(this.auth, email, pass);
    const user = userCredential.user;

    await FireProxy.updateProfile(user, { displayName: username });

    // Usamos FireProxy para Firestore también
    const userDocRef = FireProxy.doc(this.firestore, `users/${user.uid}`);
    await FireProxy.setDoc(userDocRef, {
      uid: user.uid,
      email: email,
      username: username,
      createdAt: new Date()
    });

    return userCredential;
  }

  // 2. Login
  login(email: string, pass: string) {
    return FireProxy.signIn(this.auth, email, pass);
  }

  // 3. Logout
  logout() {
    return FireProxy.signOut(this.auth);
  }

  // 4. User Observable
  get user$(): Observable<any> {
    return FireProxy.authState(this.auth);
  }

  // 5. Check Logged In
  get isLoggedIn(): Observable<boolean> {
    return FireProxy.authState(this.auth).pipe(
      map(user => user !== null)
    );
  }
}
