import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RespuestaBD } from '../interfaces/interfaces';
// +++ HE AÑADIDO 'addDoc' AQUÍ +++
import { Firestore,collection, collectionData, doc,docData, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { EntradaLore } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class Personajes {
  constructor(private http:HttpClient
    ,private firestore: Firestore
  ) { }
  
getDatos(){
return this.http.get<RespuestaBD>('https://practica10a-efad8-default-rtdb.firebaseio.com/.json',{});
}

getPersonajes(){
  const personajesRef = collection(this.firestore, 'personajes');
  console.log( personajesRef);
  return collectionData(personajesRef, { idField: 'id' });
}
getPersonajesDetalle(id:string){
  const personajeRef = doc(this.firestore, `personajes/${id}`);
  return docData(personajeRef);
}

getLore(){
  const loreRef = collection(this.firestore, 'lore');
  return collectionData(loreRef, { idField: 'id' }); 
}

getLoreDetalle(id: string) {
  const loreRef = doc(this.firestore, `lore/${id}`);
  return docData(loreRef);
}

}