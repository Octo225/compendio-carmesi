import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Firestore,collection, collectionData, doc,docData } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class Personajes {
  constructor(private http:HttpClient
    ,private firestore: Firestore
  ) { }

  // Obtener lista de lore
getLore(){
  const loreRef = collection(this.firestore, 'lore');
  return collectionData(loreRef, { idField: 'id' }); 
}

// Obtener detalle de un lore por su ID
getLoreDetalle(id: string) {
  const loreRef = doc(this.firestore, `lore/${id}`);
  return docData(loreRef);
}

}