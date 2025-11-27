import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  serverTimestamp,
  collectionData,
  orderBy,
  query,
  doc,
  docData,
  limit,
  where,
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Post } from '../interfaces/interfaces';

// --- WRAPPER PARA TESTING ---
// Agrupamos las funciones de la librería en un objeto local.
// Esto permite que spyOn funcione sin errores de "read-only".
export const FirestoreProxy = {
  collection: collection,
  addDoc: addDoc,
  serverTimestamp: serverTimestamp,
  collectionData: collectionData,
  query: query,
  orderBy: orderBy,
  doc: doc,
  docData: docData,
  limit: limit,
  where: where
};

@Injectable({
  providedIn: 'root',
})
export class Foro {
  constructor(private firestore: Firestore, private auth: Auth) {}

  // Función para crear un nuevo post
  async createPost(title: string, content: string, category: string) {
    const user = this.auth.currentUser;

    if (!user) throw new Error('Usuario no autenticado');

    const postData = {
      title: title,
      content: content,
      category: category,
      authorId: user.uid,
      authorName: user.displayName || 'Usuario',
      createdAt: FirestoreProxy.serverTimestamp(),
    };

    // Usamos el Proxy en lugar de la función directa
    const postsCollection = FirestoreProxy.collection(this.firestore, 'posts');
    return await FirestoreProxy.addDoc(postsCollection, postData);
  }

  getPosts(): Observable<Post[]> {
    const postsCollection = FirestoreProxy.collection(this.firestore, 'posts');
    // Creamos query ordenando por fecha descendente
    const q = FirestoreProxy.query(postsCollection, FirestoreProxy.orderBy('createdAt', 'desc'));
    return FirestoreProxy.collectionData(q, { idField: 'id' }) as Observable<Post[]>;
  }

  // 1. Obtener un post específico por su ID
  getPostById(postId: string): Observable<any> {
    const postDocRef = FirestoreProxy.doc(this.firestore, `posts/${postId}`);
    return FirestoreProxy.docData(postDocRef, { idField: 'id' });
  }

  // 2. Obtener los comentarios de un post
  getComments(postId: string): Observable<any[]> {
    const commentsRef = FirestoreProxy.collection(this.firestore, `posts/${postId}/comments`);
    const q = FirestoreProxy.query(commentsRef, FirestoreProxy.orderBy('createdAt', 'asc'));
    return FirestoreProxy.collectionData(q, { idField: 'id' });
  }

  // 3. Agregar un comentario a un post
  async addComment(postId: string, content: string) {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Debes estar logueado');

    const commentsRef = FirestoreProxy.collection(this.firestore, `posts/${postId}/comments`);
    return FirestoreProxy.addDoc(commentsRef, {
      content,
      authorId: user.uid,
      authorName: user.displayName || 'Anónimo',
      createdAt: FirestoreProxy.serverTimestamp()
    });
  }

  getRecentPostsByCategory(category: string, amount: number): Observable<Post[]> {
    const postsCollection = FirestoreProxy.collection(this.firestore, 'posts');

    const q = FirestoreProxy.query(
      postsCollection,
      FirestoreProxy.where('category', '==', category),
      FirestoreProxy.orderBy('createdAt', 'desc'),
      FirestoreProxy.limit(amount)
    );

    return FirestoreProxy.collectionData(q, { idField: 'id' }) as Observable<Post[]>;
  }

  // Métodos auxiliares (ya no estrictamente necesarios para test, pero útiles si los usas fuera)
  public getCurrentUser() {
    return this.auth.currentUser;
  }
}
