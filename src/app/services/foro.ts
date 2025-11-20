import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, serverTimestamp, collectionData, orderBy, query } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Post } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class Foro {
  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) {}

  // Función para crear un nuevo post
  async createPost(title: string, content: string) {
    // CAMBIO: Usamos el wrapper para obtener el usuario
    const user = this.getCurrentUser();

    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const postData = {
      title: title,
      content: content,
      authorId: user.uid,
      authorName: user.displayName || 'Usuario Anónimo',
      // CAMBIO: Usamos wrapper para el timestamp
      createdAt: this.getTimestamp(),
    };

    // CAMBIO: Usamos wrappers
    const postsCollection = this.getCollectionRef('posts');
    return await this.ejecutarAddDoc(postsCollection, postData);
  }

  getPosts(): Observable<Post[]> {
    // CAMBIO: Usamos wrappers
    const postsCollection = this.getCollectionRef('posts');
    const q = this.crearQuery(postsCollection);
    return this.obtenerCollectionData(q);
  }

  // --- MÉTODOS ENVOLTORIOS (Wrappers para Testing) ---
  // Estos métodos existen solo para poder ser "espiados" en las pruebas

  public getCurrentUser() {
    return this.auth.currentUser;
  }

  public getCollectionRef(path: string) {
    return collection(this.firestore, path);
  }

  public ejecutarAddDoc(collectionRef: any, data: any) {
    return addDoc(collectionRef, data);
  }

  public getTimestamp() {
    return serverTimestamp();
  }

  public crearQuery(collectionRef: any) {
    return query(collectionRef, orderBy('createdAt', 'desc'));
  }

  public obtenerCollectionData(queryRef: any): Observable<Post[]> {
    return collectionData(queryRef, { idField: 'id' }) as Observable<Post[]>;
  }
}