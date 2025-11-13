import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RespuestaBD, RespuestaDetalle } from '../interfaces/interfaces';
import { map } from 'rxjs';
import { Firestore,collection, collectionData, doc,docData } from '@angular/fire/firestore';
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

// getDetalleUsuario(id: number) {
//   return this.http.get<RespuestaBD>('https://practica10a-efad8-default-rtdb.firebaseio.com/.json').pipe(
//     map((response: RespuestaBD) => {
//       const personaje = response.data.find((item) => item.id === id);
//       if (!personaje) {
//         throw new Error(`Personaje con ID ${id} no encontrado`);
//       }
//       return personaje;
//     })
//   );  
// }

getPersonajes(){
  const personajesRef = collection(this.firestore, 'personajes');
  console.log( personajesRef);
  return collectionData(personajesRef, { idField: 'id' });
}
getPersonajesDetalle(id:string){
  const personajeRef = doc(this.firestore, `personajes/${id}`);
  return docData(personajeRef);
}

}
