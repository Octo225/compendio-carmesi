import { Component, OnInit } from '@angular/core';
import { Personajes } from 'src/app/services/personajes';
import { Personajes as PersonajesApi } from '../../interfaces/interfaces';
import { personajesFirebase } from '../../interfaces/interfaces';
import { RespuestaBD } from '../../interfaces/interfaces';
import { ModalController } from '@ionic/angular';
import { DetalleComponent } from '../../componentes/detalle/detalle.component';
interface Elemento{
  icono:string;
  nombre:string;
  ruta:string;
}

@Component({
  standalone: false,
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})


export class InicioPage implements OnInit {
  personajesRecientes: personajesFirebase[]=[];
  
  elementos: Elemento[]=[
    {
      icono:'newspaper-outline',
      nombre:'Noticias',
      ruta:'/noticias'
    }
  ];

  constructor(
    private servicioPersonajes: Personajes,
    private modalCtrl: ModalController
  ) { }

  async verDetalle(id:string){
    const modal=await this.modalCtrl.create({
      component: DetalleComponent,
      componentProps:{id}
    });
     modal.present();
  }

  ngOnInit() {
    this.servicioPersonajes.getPersonajes().subscribe((respuesta)=>{
      respuesta.forEach((personaje=>{
        this.personajesRecientes.push(<personajesFirebase>personaje);
      }))
  })
  }

}
