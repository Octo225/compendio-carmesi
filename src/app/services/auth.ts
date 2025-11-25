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
    
    // 1. Crear usuario en Auth
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, pass);
    const user = userCredential.user;

    // 2. Actualizar el perfil de Auth (esto permite que user.displayName tenga valor)
    await updateProfile(user, { displayName: username });

    // 3. Crear documento en la colección 'users' de Firestore
    // Usamos el UID de Auth como ID del documento para que coincidan
    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    await setDoc(userDocRef, {
      uid: user.uid,
      email: email,
      username: username,
      createdAt: new Date()
    });

    return userCredential;
  }

  // 2. Login
  login(email: string, pass: string) {
    return signInWithEmailAndPassword(this.auth, email, pass);
  }

  // 3. Logout
  logout() {
    return signOut(this.auth);
  }

  // 4. Obtener el usuario actual (útil para el Guard)
  get user$(): Observable<any> {
    return authState(this.auth);
  }

  // 5. Verificar si está logueado (devuelve true/false)
  get isLoggedIn(): Observable<boolean> {
    return authState(this.auth).pipe(
      map(user => user !== null)
    );
  }
}