import { Component, Input, OnInit } from '@angular/core';
import { Personajes } from '../../services/personajes';
import { Detalle, InfGeneral, RespuestaDetalle,personajesFirebase } from '../../interfaces/interfaces';
import { ModalController } from '@ionic/angular';
// interface RespuestaDetalle {
//   data: Detalle;
//   support: {
//     text: string;
//     url: string;
//   };
// }

@Component({
  standalone: false,
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss'],
})


export class DetalleComponent implements OnInit {
  detallePersonaje={} as personajesFirebase;
  @Input() id!: string; 
  personaje!: Detalle;
  InfoDetalle!: InfGeneral; 

  constructor(
    private servicioPersonajes: Personajes,
    private modalCtrl: ModalController
  ) {}

  regresar(){
    this.modalCtrl.dismiss();
  }

  ngOnInit() {
    this.servicioPersonajes.getPersonajesDetalle(this.id).subscribe(respuesta => {
      this.detallePersonaje=<personajesFirebase>respuesta;

    });
    // this.detallePersonaje.getPersonajesDetalle(this.id).subscribe((personaje) => {
    //   this.personaje = personaje;
    // });
  }
}