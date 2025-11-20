import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Personajes {
  constructor(
    private firestore: Firestore
  ) {}

  // Obtener lista de lore
  getLore(): Observable<any[]> {
    // CAMBIO: Usamos el wrapper
    const loreRef = this.getCollectionRef('lore');
    // CAMBIO: Usamos el wrapper
    return this.getCollectionData(loreRef);
  }

  // Obtener detalle de un lore por su ID
  getLoreDetalle(id: string): Observable<any> {
    // CAMBIO: Usamos el wrapper
    const loreRef = this.getDocRef(`lore/${id}`);
    // CAMBIO: Usamos el wrapper
    return this.getDocData(loreRef);
  }

  // --- MÉTODOS ENVOLTORIOS (Wrappers) ---
  // Estos métodos aíslan las llamadas a Firebase para facilitar las pruebas

  public getCollectionRef(path: string) {
    return collection(this.firestore, path);
  }

  public getCollectionData(ref: any) {
    return collectionData(ref, { idField: 'id' });
  }

  public getDocRef(path: string) {
    return doc(this.firestore, path);
  }

  public getDocData(ref: any) {
    return docData(ref);
  }
}