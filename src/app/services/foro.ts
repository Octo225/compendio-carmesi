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
      category: category, // <--- Guardamos la categoría
      authorId: user.uid,
      authorName: user.displayName || 'Usuario',
      createdAt: serverTimestamp(),
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

  // 1. Obtener un post específico por su ID
  getPostById(postId: string): Observable<any> {
    const postDocRef = doc(this.firestore, `posts/${postId}`);
    return docData(postDocRef, { idField: 'id' });
  }

  // 2. Obtener los comentarios de un post (Subcolección)
  getComments(postId: string): Observable<any[]> {
    const commentsRef = collection(this.firestore, `posts/${postId}/comments`);
    const q = query(commentsRef, orderBy('createdAt', 'asc')); // Orden ascendente (antiguos primero)
    return collectionData(q, { idField: 'id' });
  }

  // 3. Agregar un comentario a un post
  async addComment(postId: string, content: string) {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Debes estar logueado');

    const commentsRef = collection(this.firestore, `posts/${postId}/comments`);
    return addDoc(commentsRef, {
      content,
      authorId: user.uid,
      authorName: user.displayName || 'Anónimo',
      createdAt: serverTimestamp()
    });
  }

  getRecentPostsByCategory(category: string, amount: number): Observable<Post[]> {
    const postsCollection = collection(this.firestore, 'posts');
    
    const q = query(
      postsCollection, 
      where('category', '==', category), // Filtra por 'guia' o 'foro'
      orderBy('createdAt', 'desc'),      // Los más recientes primero
      limit(amount)                      // Solo trae la cantidad que pidas (2)
    );

    return collectionData(q, { idField: 'id' }) as Observable<Post[]>;
  }
}
