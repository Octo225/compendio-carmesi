import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, serverTimestamp } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth'; // Para obtener el usuario actual

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
      authorName: user.displayName || 'Usuario Anónimo', // Asume que tienes displayName
      createdAt: serverTimestamp() // Usa el timestamp del servidor
    };

    // Obtenemos la referencia a la colección 'posts'
    const postsCollection = collection(this.firestore, 'posts');
    
    // Añadimos el nuevo documento
    return await addDoc(postsCollection, postData);
  }
  
}