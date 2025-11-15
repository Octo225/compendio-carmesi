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
  ) { }

  // Función para crear un nuevo post
  async createPost(title: string, content: string) {
    //FUNCION PARA AUTENTICAR USUARIO
    const user = this.auth.currentUser;

    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const postData = {
      title: title,
      content: content,
      authorId: user.uid,
      authorName: user.displayName || 'Usuario Anónimo', 
      createdAt: serverTimestamp()
    };

    // Obtenemos la referencia a la colección 'posts'
    const postsCollection = collection(this.firestore, 'posts');
    
    // Añadimos el nuevo documento
    return await addDoc(postsCollection, postData);
  }

  getPosts(): Observable<Post[]> {
    const postsCollection = collection(this.firestore, 'posts');
    
    const q = query(postsCollection, orderBy('createdAt', 'desc'));

    return collectionData(q, { idField: 'id' }) as Observable<Post[]>;
  }
  
}